import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  InputGroup,
  Input,
  InputLeftElement,
  Badge,
  Image,
} from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon} from "@chakra-ui/icons";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { useCart } from "../../context/CartContext";


interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  const { cartCount, setCartCount } = useCart(); // Access cart count from CartContext
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);


  // Decode JWT token to check the role
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decoded: any = jwtDecode(token); // Use the imported jwt-decode library
        console.log("Decoded Token:", decoded); // Debugging
        if (decoded.exp * 1000 > Date.now()) {
          setIsLoggedIn(true);
          setUserRole(decoded.role); // Ensure role is set correctly
        } else {
          localStorage.removeItem("jwt");
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        setIsLoggedIn(false);
        setUserRole(null);
      }
    }
  }, [setIsLoggedIn]);

  function jwtDecode(token: string): any {
    return JSON.parse(atob(token.split(".")[1]));
  }
  
  
  

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
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
                src="/images/KanzaJewelriesLogo.png" // Replace with the correct path to the new logo
                alt="Kanza Jewelry Logo"
                maxWidth={{ base: "120px", sm: "150px", md: "180px" }} // Adjust sizes for responsiveness
                height="auto"
                objectFit="contain"
                display="inline-block" // Ensure proper alignment
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
          {/* Cart Icon with Badge */}
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

      {/* MOBILE MENU DRAWER */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Link to="/" onClick={onClose}>
              <Image
                src="/images/KanzaJewelriesLogo.png" 
                alt="Kanza Jewelry Logo"
                maxWidth="120px" 
                height="auto"
                objectFit="contain"
                mx="auto" // Center the logo horizontally
              />
            </Link>
          </DrawerHeader>
          <DrawerBody>
          <VStack align="start" spacing={4}>
            {/* Render product categories */}
            {categories.map((category) => (
              <Link key={category} to={`/products/${category.toLowerCase()}`} onClick={onClose}>
                {category}
              </Link>
            ))}
            <Divider my={6} />
            {/* Profile or Login options */}
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={onClose}>My Profile</Link>
                <Button onClick={handleLogout} variant="link">Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={onClose}>Login</Link>
                <Link to="/signup" onClick={onClose}>Signup</Link>
              </>
            )}
            {/* Cart link */}
            <Link to="/cart" onClick={onClose}>Basket</Link>
          </VStack>
        </DrawerBody>

        </DrawerContent>
      </Drawer>

    </Box>
  );
};

export default Navbar;
function jwtDecode(token: string): any {
  throw new Error("Function not implemented.");
}

