import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { behaviorApi } from "../services/behaviorApi";
import { analytics } from "../services/analyticsTracker";
import { api } from "../services/api";
import CartDrawer from "../components/CartDrawer";

const CartContext = createContext();

const getProductKey = (product) => product.id ?? product._id;
const GUEST_CART_KEY = "weathercart";

function getUserCartKey(userId) {
  return `weathercart-user-${userId}`;
}

function readCart(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function mergeCartItems(...cartLists) {
  const merged = new Map();

  for (const item of cartLists.flat()) {
    const key = getProductKey(item);
    if (!key) continue;

    const existing = merged.get(String(key));
    if (!existing) {
      merged.set(String(key), { ...item });
    } else if (Number(item.quantity) > Number(existing.quantity)) {
      merged.set(String(key), { ...existing, ...item });
    }
  }

  return [...merged.values()];
}

export function CartProvider({ children }) {
  const { user, token, loading: authLoading } = useAuth();
  const userId = user?.id || user?._id || null;
  const [cart, setCart] = useState(() => readCart(GUEST_CART_KEY));
  const [hydratedOwnerId, setHydratedOwnerId] = useState(undefined);

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("weathercart-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return undefined;

    let cancelled = false;
    setHydratedOwnerId(undefined);

    if (!userId) {
      setCart(readCart(GUEST_CART_KEY));
      setHydratedOwnerId(null);
      return undefined;
    }

    const guestCart = readCart(GUEST_CART_KEY);
    const cachedUserCart = readCart(getUserCartKey(userId));
    setCart([]);

    async function loadUserCart() {
      try {
        const result = await api.getCart();
        const mergedCart = mergeCartItems(
          result.items || [],
          cachedUserCart,
          guestCart
        );
        if (
          cachedUserCart.length > 0 ||
          guestCart.length > 0
        ) {
          await api.saveCart(mergedCart);
        }
        if (!cancelled) {
          localStorage.removeItem(GUEST_CART_KEY);
          setCart(mergedCart);
        }
      } catch (error) {
        console.error("Could not load account cart:", error);
        if (!cancelled) {
          setCart(mergeCartItems(cachedUserCart, guestCart));
        }
      } finally {
        if (!cancelled) setHydratedOwnerId(userId);
      }
    }

    loadUserCart();
    return () => {
      cancelled = true;
    };
  }, [authLoading, token, userId]);

  useEffect(() => {
    if (authLoading || hydratedOwnerId !== userId) return undefined;

    const storageKey = userId
      ? getUserCartKey(userId)
      : GUEST_CART_KEY;
    localStorage.setItem(storageKey, JSON.stringify(cart));

    if (!userId || !token) return undefined;

    const timeoutId = window.setTimeout(() => {
      api.saveCart(
        cart.map((item) => ({
          productId: getProductKey(item),
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        }))
      ).catch((error) => {
        console.error("Could not sync account cart:", error);
      });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [authLoading, cart, hydratedOwnerId, token, userId]);

  useEffect(() => {
    localStorage.setItem(
      "weathercart-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = (product, quantity = 1, showDrawer = true) => {
    behaviorApi.cartAdd(product._id || product.id);
    analytics.trackCartAdd(product, quantity);
    setCart((current) => {
      const existing = current.find(
        (item) => getProductKey(item) === getProductKey(product)
      );

      if (existing) {
        return current.map((item) =>
          getProductKey(item) === getProductKey(product)
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity,
        },
      ];
    });

    if (showDrawer) {
      setIsDrawerOpen(true);
    }
  };

  const removeFromCart = (id) => {
    setCart((current) =>
      current.filter((item) => getProductKey(item) !== id)
    );
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((current) =>
      current.map((item) =>
        getProductKey(item) === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some(
        (item) => getProductKey(item) === getProductKey(product)
      );

      if (exists) {
        return current.filter(
          (item) => getProductKey(item) !== getProductKey(product)
        );
      }

      return [...current, product];
    });
  };

  const isWishlisted = (id) => {
    return wishlist.some((item) => getProductKey(item) === id);
  };

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        subtotal,
        shipping,
        total,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
