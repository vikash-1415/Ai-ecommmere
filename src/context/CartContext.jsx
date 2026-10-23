import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { behaviorApi } from "../services/behaviorApi";
import { analytics } from "../services/analyticsTracker";
import CartDrawer from "../components/CartDrawer";

const CartContext = createContext();

const getProductKey = (product) => product.id ?? product._id;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("weathercart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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
    localStorage.setItem("weathercart", JSON.stringify(cart));
  }, [cart]);

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
