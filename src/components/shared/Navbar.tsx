import React from "react";
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
} from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
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

  // Decode JWT token to check the role
  const token = localStorage.getItem("jwt");
  let userRole = "";
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userRole = decoded.role; // Assuming your token has a "role" field
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
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
        <Box fontSize="2xl" fontWeight="bold">
          LOGO
        </Box>

        {/* SEARCH BAR */}
        <Box display={{ base: "none", lg: "block" }} mr={10}>
          <InputGroup width="350px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.500" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search for products, brands, etc.."
              variant="filled"
              bg="gray.50"
              _placeholder={{ color: "gray.400" }}
            />
          </InputGroup>
        </Box>

        {/* DESKTOP MENU */}
        <HStack spacing={8} display={{ base: "none", lg: "flex" }}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="link"
              _hover={{ textDecoration: "none", color: "#7B0828" }}
            >
              Jewelries
            </MenuButton>
            <MenuList>
              {categories.map((category) => (
                <MenuItem key={category} as={Link} to={`/products/${category.toLowerCase()}`}>
                  {category}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Link to="/popular" style={{ fontWeight: "medium" }}>
            Popular
          </Link>
          <Link to="/collections" style={{ fontWeight: "medium" }}>
            Collections
          </Link>
        </HStack>

        {/* LOGIN/LOGOUT AND CART */}
        <HStack spacing={6}>
        {isLoggedIn ? (
            <>
              {userRole === "admin" ? (
                <Link to="/admin">
                  <Button variant="ghost">Dashboard</Button>
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
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <Menu>
                <MenuButton as={Link}>
                  Jewelries
                </MenuButton>
                <VStack align="start" spacing={2} ml={4}>
                  {categories.map((category) => (
                    <Link key={category} to={`/products/${category.toLowerCase()}`}>
                      {category}
                    </Link>
                  ))}
                </VStack>
              </Menu>
              <Link to="/popular">Popular</Link>
              <Link to="/collections">Collections</Link>
              <Divider my={6} />
              {isLoggedIn ? (
                <>
                  <Link to="/profile">My Profile</Link>
                  <Button onClick={handleLogout} variant="link">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    Login
                  </Link>
                  <Link to="/signup">Signup</Link>
                </>
              )}
              <Link to="/cart">Basket</Link>
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

