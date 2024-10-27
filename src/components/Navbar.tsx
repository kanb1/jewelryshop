import { 
  Box, 
  Flex, 
  HStack, 
  IconButton, 
  Link, 
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
} from "@chakra-ui/react";

import { ChevronDownIcon, StarIcon, HamburgerIcon } from "@chakra-ui/icons";
import { AiOutlineShoppingCart } from 'react-icons/ai'; // Shopping Cart icon
import { FaUser } from 'react-icons/fa'; // User icon

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="white" px={10} boxShadow="sm">
      <Flex h={28} alignItems="center" justifyContent="space-between">


        {/* MOBILE UP TO TABLET */}
        
        {/* Left: Hamburger Icon for mobile/tablet */}
        <IconButton
          size="md"
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          display={{ base: "block", lg: "none" }}  // Show only on mobile/tablet
          onClick={onOpen}
        />

        {/* Center: Logo (only for mobile and tablet) */}
      

        {/* Right: Profile and Basket for mobile/tablet */}
        <HStack spacing={2} display={{ base: "flex", lg: "none" }}>
          <Link href="/profile" _hover={{ textDecoration: "none" }}>
            <IconButton icon={<FaUser />} aria-label="My Profile" variant="ghost" />
          </Link>
          <Link href="/cart" _hover={{ textDecoration: "none" }}>
            <IconButton icon={<AiOutlineShoppingCart />} aria-label="Basket" variant="ghost" />
          </Link>
        </HStack>







        {/* DESKTOP */}

        {/* Left: Logo and Links */}
        <Flex direction="column" alignItems="flex-start" flex={1} display={{ base: "none", lg: "flex" }}>
          {/* Logo */}
          <Box fontSize="2xl" fontWeight="bold">
            LOGO
          </Box>
          {/* Links below Logo */}
          <HStack spacing={8}>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="link" 
              _hover={{textDecoration:"none", color:"#7B0828"}} p={1}
             
              >
                Jewelries
              </MenuButton>
              <MenuList>
                <MenuItem>Necklaces</MenuItem>
                <MenuItem>Rings</MenuItem>
                <MenuItem>Earrings</MenuItem>
                <MenuItem>Bracelets</MenuItem>
              </MenuList>
            </Menu>

            <Link href="/popular" fontWeight="medium" _hover={{textDecoration:"none", color:"#7B0828"}}>Popular</Link>
            <Link href="/collections" fontWeight="medium" _hover={{textDecoration:"none", color:"#7B0828"}}>Collections</Link>
          </HStack>
        </Flex>

        {/* Center: Search Bar */}
        <Box display={{ base: "none", lg: "block" }} flex={1}>
          <InputGroup maxWidth="400px" mx="auto">
            <Input placeholder="Search jewelry, brands, etc..." />
          </InputGroup>
        </Box>

        {/* Right: Icons for Profile, Favourites, Search, Basket */}
        <HStack spacing={6} display={{ base: "none", lg: "flex" }}>
          {/* My Profile */}
          <Box textAlign="center">
            <Link href="/profile" display="block" _hover={{ textDecoration: "none" }}>
              <IconButton icon={<FaUser />} aria-label="My Profile" variant="ghost"  />
              <Text mt={2} fontSize="sm" color="black">Profile</Text>
            </Link>
          </Box>

          {/* Favourites */}
          <Box textAlign="center">
            <Link href="/likes" display="block" _hover={{ textDecoration: "none" }}>
              <IconButton icon={<StarIcon />} aria-label="Likes" variant="ghost" />
              <Text mt={2} fontSize="sm" color="black">Favourites</Text>
            </Link>
          </Box>

          {/* Basket */}
          <Box textAlign="center">
            <Link href="/cart" display="block" _hover={{ textDecoration: "none" }}>
              <IconButton icon={<AiOutlineShoppingCart />} aria-label="Basket" variant="ghost" />
              <Text mt={2} fontSize="sm" color="black">Basket</Text>
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
              {/* Jewelries links in mobile drawer */}
              <Menu>
                <MenuButton as={Link} _hover={{ textDecoration: "none" }} >
                  Jewelries
                </MenuButton>
                <VStack align="start" spacing={2} ml={4}>
                  <Link href="#">Necklaces</Link>
                  <Link href="#">Rings</Link>
                  <Link href="#">Earrings</Link>
                  <Link href="#">Bracelets</Link>
                </VStack>
              </Menu>

              <Link href="/popular" onClick={onClose}>Popular</Link>
              <Link href="/collections" onClick={onClose}>Collections</Link>

              <Divider my={6} />

              <Link href="/profile" onClick={onClose}>My Profile</Link>
              <Link href="/likes" onClick={onClose}>Favourites</Link>
              <Link href="/search" onClick={onClose}>Search</Link>
              <Link href="/cart" onClick={onClose}>Basket</Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
