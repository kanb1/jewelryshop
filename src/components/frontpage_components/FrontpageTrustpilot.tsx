// import { Box, Heading, Text, Icon, VStack, useBreakpointValue } from "@chakra-ui/react";
// import { FaStar } from "react-icons/fa";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";

// const FrontpageTrustpilot = () => {
//     //We use swiperJS for making the slide on reviews possible on mobile 
//     // The const isMobile = useBreakpointValue({ base: true, md: false }); line is now outside the return statement, as this ensures the code runs correctly
//     // This setup will render a slider when the viewport is small (mobile) and switch to a grid layout on larger screens.
//     const isMobile = useBreakpointValue({ base: true, md: false });

//     return (
//         <Box as="section"py={10} px={{ base: 4, md: 10 }}>
//             <VStack spacing={6} textAlign="center">
//                 {/* Title and Trustpilot Logo */}
//                 <Heading size="main_heading">
//                     What Our Customers Are Saying
//                 </Heading>
//                 <Text fontSize="sm" color="gray.500" mb={{base:"2"}}>
//                     Reviews provided by <Text as="span" color="teal.500" fontWeight="bold">Trustpilot</Text>
//                 </Text>
//             </VStack>

//             {/* Carousel for Mobile and Grid for Desktop */}
//             {isMobile ? (
//                 <Swiper spaceBetween={10} slidesPerView={1}>
//                     {[1, 2, 3, 4, 5].map((_, index) => (
//                         <SwiperSlide key={index}>
//                             <Box
//                                 p={6}
//                                 bg="white"
//                                 boxShadow="lg"
//                                 borderRadius="md"
//                                 border="1px"
//                                 borderColor="gray.200"
//                                 textAlign="left"
//                                 transition="transform 0.2s"
//                             >
//                                 {/* Stars */}
//                                 <Box display="flex" mb={4}>
//                                     {Array(5).fill("").map((_, i) => (
//                                         <Icon key={i} as={FaStar} color="teal.400" mr={1} />
//                                     ))}
//                                 </Box>

//                                 {/* Review Text */}
//                                 <Text fontSize="sm" color="gray.700" mb={4}>
//                                     “Amazing service! The jewelry was beautifully crafted and arrived on time. I highly recommend this shop!”
//                                 </Text>

//                                 {/* Reviewer Name */}
//                                 <Text fontWeight="bold" color="gray.800">
//                                     - John Doe
//                                 </Text>
//                             </Box>
//                         </SwiperSlide>
//                     ))}
//                 </Swiper>
//             ) : (
//                 <Box
//                     display="grid"
//                     gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
//                     gap={6}
//                     mt={8}
//                     mx="auto"
//                     maxW="1200px"
//                 >
//                     {[1, 2, 3, 4, 5].map((_, index) => (
//                         <Box
//                             key={index}
//                             p={6}
//                             bg="white"
//                             boxShadow="lg"
//                             borderRadius="md"
//                             border="1px"
//                             borderColor="gray.200"
//                             textAlign="left"
//                             transition="transform 0.2s"
//                             _hover={{ transform: "scale(1.05)" }}
//                         >
//                             {/* Stars */}
//                             <Box display="flex" mb={4}>
//                                 {Array(5).fill("").map((_, i) => (
//                                     <Icon key={i} as={FaStar} color="teal.400" mr={1} />
//                                 ))}
//                             </Box>

//                             {/* Review Text */}
//                             <Text fontSize="sm" color="gray.700" mb={4}>
//                                 “Amazing service! The jewelry was beautifully crafted and arrived on time. I highly recommend this shop!”
//                             </Text>

//                             {/* Reviewer Name */}
//                             <Text fontWeight="bold" color="gray.800">
//                                 - John Doe
//                             </Text>
//                         </Box>
//                     ))}
//                 </Box>
//             )}
//         </Box>
//     );
// };

// export default FrontpageTrustpilot;
