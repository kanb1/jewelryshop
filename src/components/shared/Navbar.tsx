import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";

import { ChevronDownIcon, StarIcon, HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import { AiOutlineShoppingCart } from "react-icons/ai"; // Shopping Cart icon
import { FaUser } from "react-icons/fa"; // User icon
import { Link } from "react-router-dom"; // Import React Router's Link
import axios from "axios"; // Import Axios for API calls

interface Category {
  _id: string;
  name: string;
}

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = useState<Category[]>([]); // Add type annotation here

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>("http://localhost:5001/api/categories"); // Specify type
        setCategories(response.data); // TypeScript now knows this is an array of Category
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
  
    fetchCategories();
  }, []);
  

  return (
    <Box bg="white" px={10} boxShadow="sm">
      <Flex h={28} alignItems="center" justifyContent="space-between">
        {/* MOBILE UP TO TABLET */}
        <IconButton
          size="md"
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          display={{ base: "block", lg: "none" }}
          onClick={onOpen}
        />

        {/* Right: Profile and Basket for mobile/tablet */}
        <HStack spacing={2} display={{ base: "flex", lg: "none" }}>
          <Link to="/profile">
            <IconButton icon={<FaUser />} aria-label="My Profile" variant="ghost" />
          </Link>
          <Link to="/cart">
            <IconButton icon={<AiOutlineShoppingCart />} aria-label="Basket" variant="ghost" />
          </Link>
        </HStack>

        {/* DESKTOP */}
        <Flex direction="column" alignItems="flex-start" flex={1} display={{ base: "none", lg: "flex" }}>
          <Box fontSize="2xl" fontWeight="bold">
            LOGO
          </Box>
          <HStack spacing={8}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="link" _hover={{ textDecoration: "none", color: "#7B0828" }} p={1}>
                Jewelries
              </MenuButton>
              <MenuList>
              {categories.map((category) => (
                  <MenuItem key={category._id} as={Link} to={`/products/${category.name.toLowerCase()}`}>
                    {category.name}
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
        </Flex>

        {/* Search Bar */}
        <Box display={{ base: "none", lg: "block" }} mr={10}>
          <InputGroup width="350px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.500" />
            </InputLeftElement>
            <Input
              type="text"
              placeholder="Search for products, brands etc.."
              variant="filled"
              bg="gray.50"
              _placeholder={{ color: "gray.400" }}
            />
          </InputGroup>
        </Box>

        {/* Right: Icons for Profile, Favourites, Basket */}
        <HStack spacing={6} display={{ base: "none", lg: "flex" }}>
          <Box textAlign="center">
            <Link to="/profile">
              <IconButton icon={<FaUser />} aria-label="My Profile" variant="ghost" />
              <Text mt={2} fontSize="sm" color="black">
                Profile
              </Text>
            </Link>
          </Box>
          <Box textAlign="center">
            <Link to="/likes">
              <IconButton icon={<StarIcon />} aria-label="Likes" variant="ghost" />
              <Text mt={2} fontSize="sm" color="black">
                Favourites
              </Text>
            </Link>
          </Box>
          <Box textAlign="center">
            <Link to="/cart">
              <IconButton icon={<AiOutlineShoppingCart />} aria-label="Basket" variant="ghost" />
              <Text mt={2} fontSize="sm" color="black">
                Basket
              </Text>
            </Link>
          </Box>
        </HStack>
      </Flex>

      {/* Drawer for mobile menu */}
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
                    <Link key={category._id} to={`/products/${category.name.toLowerCase()}`}>
                      {category.name}
                    </Link>
                  ))}
                </VStack>
              </Menu>
              <Link to="/popular">Popular</Link>
              <Link to="/collections">Collections</Link>
              <Divider my={6} />
              <Link to="/profile">My Profile</Link>
              <Link to="/likes">Favourites</Link>
              <Link to="/search">Search</Link>
              <Link to="/cart">Basket</Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
