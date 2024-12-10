import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Divider,
  Button,
  Badge,
  Image,
} from "@chakra-ui/react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from "../../context/CartContext";
import { HamburgerIcon } from "@chakra-ui/icons";

const Navbar: React.FC = () => {
  const { isLoggedIn, userRole, setIsLoggedIn, setUserRole } = useAuthContext();
  const { cartCount, setCartCount } = useCart();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setUserRole(null);
    setCartCount(0);
    navigate("/login");
  };

  const categories = ["Rings", "Necklaces", "Bracelets", "Earrings"];

  return (
    <Box bg="white" px={10} boxShadow="sm">
      <Flex h={28} alignItems="center" justifyContent="space-between">
        {/* MOBILE/TABLET MENU */}
        <IconButton
          size="md"
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          display={{ base: "block", lg: "none" }}
          onClick={onOpen}
        />

        {/* LOGO */}
        <Box display={{ base: "none", lg: "block" }}>
          <Link to="/">
            <Image
              src="/images/KanzaJewelriesLogo.png"
              alt="Kanza Jewelry Logo"
              maxWidth={{ base: "120px", sm: "150px", md: "180px" }}
              height="auto"
              objectFit="contain"
              display="inline-block"
            />
          </Link>
        </Box>

        {/* DESKTOP MENU */}
        <HStack spacing={8} display={{ base: "none", lg: "flex" }}>
          {categories.map((category) => (
            <Link
              key={category}
              to={`/products/${category.toLowerCase()}`}
              style={{ fontWeight: "medium", textDecoration: "none" }}
            >
              {category}
            </Link>
          ))}
        </HStack>

        {/* LOGIN/LOGOUT AND CART */}
        <HStack spacing={{ base: 2, lg: 6 }} alignItems="center">
          {isLoggedIn ? (
            <>
              {userRole === "admin" ? (
                <Link to="/admin">
                  <Button variant="ghost">Admin Dashboard</Button>
                </Link>
              ) : (
                <Link to="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
              )}
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline">Signup</Button>
              </Link>
            </>
          )}
          <Link to="/cart">
            <IconButton
              icon={<AiOutlineShoppingCart />}
              aria-label="Cart"
              variant="ghost"
              size="lg"
              position="relative"
            />
            {cartCount > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="10px"
                right="10px"
              >
                {cartCount}
              </Badge>
            )}
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
