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
  // consumes those state tracking from authcontext
  // ensures that the navbar dynamically updates its UI based on the authentication state
  const { isLoggedIn, userRole, setIsLoggedIn, setUserRole } = useAuthContext();
  const { cartCount, setCartCount } = useCart();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // **************SECURITY
  // remove the JWT from localstorage
  // authcontext's states are reset (isloggedin and userrole)
  const handleLogout = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      console.warn("No token found. Logging out locally.");
      setIsLoggedIn(false);
      setUserRole(null);
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        localStorage.removeItem("jwt");
        setIsLoggedIn(false);
        setUserRole(null);
        navigate("/login");
      } else {
        console.error("Logout failed:", await response.json());
        localStorage.removeItem("jwt"); // Clear token anyway
        setIsLoggedIn(false);
        setUserRole(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("jwt"); // Clear token in case of error
      setIsLoggedIn(false);
      setUserRole(null);
      navigate("/login");
    }
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
            <Link to="/recycle" style={{ fontWeight: "medium", textDecoration: "none" }}>
              Recycle 
            </Link>

        </HStack>

        {/* LOGIN/LOGOUT AND CART */}
        {/* if isLoggedIn is true and userrole is admin, it displays a link to the admin dashboard and vice versa if role is user. If it's false it displays login and signup options */}
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

      {/* MOBILE DRAWER */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Link to="/">
              <Image
                src="/images/KanzaJewelriesLogo.png"
                alt="Kanza Jewelry Logo"
                maxWidth="120px"
                height="auto"
                objectFit="contain"
              />
            </Link>
          </DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={`/products/${category.toLowerCase()}`}
                  onClick={onClose}
                >
                  {category}
                </Link>
              ))}
              <Divider />
              {isLoggedIn ? (
                <>
                  {userRole === "admin" ? (
                    <Link to="/admin" onClick={onClose}>
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/profile" onClick={onClose}>
                      Profile
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : null}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
