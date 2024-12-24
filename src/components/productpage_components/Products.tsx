import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Grid,
  Checkbox,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
// useParams --> læser route-parametre fra URL'en fx /products/:category
// useSearchParams -->Håndterer forespørgselsparametre i URL'en fx ?page=2&type=rings
import { useParams, useSearchParams, Link } from "react-router-dom";
import ProductCard from "../shared/ProductCard";
import ButtonComponent from "../shared/ButtonComponent";
import { BACKEND_URL } from "../../config";


// Definerer typen for produkter, hvert produkt forventes at have disse felter. Images og sizes are valgfri med "?"
interface Product {
  _id: string;
  name: string;
  price: number;
  type: string;
  productCollection: string;
  images?: string[]; // Make this optional
  sizes?: string[];
}

const Products: React.FC = () => {
  // *******************************************' STATES

  // useParams henter category fra URL'en
  const { category } = useParams<{ category: string }>();
  // Henter forespørgselsparametre fra URL'en fx hvis vi vælger sort price high to low
  const [searchParams, setSearchParams] = useSearchParams();
  // Gemmer den valgte sorteringsmulighed fx pricehightolow.. det er den initial state
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "priceLowToHigh");
  // Gemmer valgte filtre
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedJewelryTypes, setSelectedJewelryTypes] = useState<string[]>(
    category === "all" || !category ? [] : [category]
  );
  // indeholder de hentede produkter
  const [products, setProducts] = useState<Product[]>([]);
  const [allCollections, setAllCollections] = useState<string[]>([]);
  // Pagination
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // indikerer om data hentes
  const [loading, setLoading] = useState(false);
  // sørger for at parametre er klar før data hentes. Når denne her komponent loader så kan der være en forsinkelse før searchparams og andre parametre bliver initialiseret. Undgår at sende en ufuldstændig forespørgsel til backend. Fungerer som en kontrolmekanisme. 
  // sat til false som default for at sige at forespørgselsparametrene er ikke klar endnu, og når category ændres, når searchParams opdateres, så bliver den true
  const [paramsReady, setParamsReady] = useState(false); // Tilføjet: Holder styr på parametre




  // ******************************************** HENT PRODUKTER FRA BACKEND
  // Trigger fetchProducts, hver gang searchParams eller paramsReady ændres
  useEffect(() => {
    if (!paramsReady) return; // Vent, indtil parametrene er klar

    // Den fetcher data fra backend
    
    const fetchProducts = async () => {
      setLoading(true);

      // Her bygger den URL'en baseret på searchParams (forespørgsllerne), så alt der står som $limit osv bliver skiftet ud med forespørgslen
      try {
        const page = searchParams.get("page") || "1";
        const limit = 6;

        const response = await fetch(
          `${BACKEND_URL}/api/products?page=${page}&limit=${limit}&${searchParams.toString()}`
        );
        const data = await response.json();
        
        // Gemmer produkter og pagination-data, altså vi opdaterer state
        setProducts(data.products);
        setTotalProducts(data.totalProducts);
        setTotalPages(data.totalPages);
        setCurrentPage(parseInt(page));
        // backend behandler forespørgslen, og sender JSON-data tilbage, som frontend bruger til at opdatere sin state (og viser de rigtige produkter frem)
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, paramsReady]);



   // ****************************** HÅNDTER KATEGORIÆNDRINGER
  //  Hver gang category ændres, fx når brugeren klikker på rings, så opdaterer forespørgselsparametre type og page
  // resetter valgte smykketyper selectedJewelryTypes
  useEffect(() => {
    if (category) {
      const params = new URLSearchParams();
      if (category !== "all") params.set("type", category.toLowerCase());
      params.set("page", "1"); // Reset til første side
      setSearchParams(params);
      setSelectedJewelryTypes(category === "all" ? [] : [category]);
      setParamsReady(true); // Marker parametrene som klar
    }
  }, [category]);


// ****************************** HENT COLLECTIONS UAFHÆNGIGT
  // Fetch collections independently
  // Hooken kører kun 1 gang når komponent loader [] tom afhængighedsarray

  useEffect(() => {
    // vi henter alle kollektionerne til at generere filtermuligheder for kollektioner i sidebaren, det bliver hentet fra backenden
    const fetchCollections = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products/collections`);
        const data = await response.json();
        // gemmer de hentede kollektioner i allCollections state
        setAllCollections(data.collections || []);
      } catch (err) {
        console.error("Error fetching collections:", err);
      }
    };

    fetchCollections();
  }, []);


// ****************************** HÅNDTER KOLLEKTION ÆNDRINGER
  const handleCollectionChange = (collection: string, isChecked: boolean) => {

    // hvis brugeren tjekker boksen (true) eller false hvis den fjernes
    const updatedCollections = isChecked
      ? [...selectedCollections, collection]
      : selectedCollections.filter((c) => c !== collection);

    // opdater seletectedCollections, den tilføjer hvis isChecked true og fjernes hvis isChecked false
    setSelectedCollections(updatedCollections);

    // Opdaterer URL parametre (searchParams)
    // Fjerner eksisterende collection-parametre
    const params = new URLSearchParams(searchParams);
    params.delete("collection");
    // Tilføjer hver valgt kollektion som en separat parameter (det at kunne vælge flere)
    updatedCollections.forEach((col) => params.append("collection", col));
    // resetter page til 1 hver gang
    params.set("page", "1"); // Reset page to 1
    // når setSearchParams ændrer URL parametrene kalder useEffect automatisk fethcProducts()
    setSearchParams(params);
  };



   // ****************************** HÅNDTER SMYKKE-TYPE ÆNDRINGER 
  const handleJewelryTypeChange = (type: string, isChecked: boolean) => {
    // type -->  den valgte smykketype
    // isChecked --> Om brugeren har valgt eller ej, true/false
    const updatedJewelryTypes = isChecked
      ? [...selectedJewelryTypes, type]
      : selectedJewelryTypes.filter((t) => t !== type);
  
    //opdaterer, tilføjer/fjerner selectedJwelryType 
    setSelectedJewelryTypes(updatedJewelryTypes);
    
    // Opdaterer URL parametre (searchParams)
    const params = new URLSearchParams(searchParams);
    // Fjern alle tidligere 'type'-parametre
    params.delete("type"); 
    // Tilføj hver ny valgt type som en separat parameter
    updatedJewelryTypes.forEach((t) => params.append("type", t)); 
    params.set("page", "1"); // Gå altid tilbage til side 1
    setSearchParams(params);
  };
  



  // ****************************** HÅNDTER SORT
  // Handle Sort Change
  const handleSortChange = (sortOption: string) => {
    // opdaterer den vlagte sorteringsmulighed i state
    setSortOption(sortOption);
    const params = new URLSearchParams(searchParams);
    // tilføjer/ændrer sort i searchParams
    params.set("sort", sortOption);
    // resetter page til 1
    params.set("page", "1");
    setSearchParams(params);
  };





  // ****************************** PAGINATION FRONTEND

  const handlePageChange = (page: number) => {
    // Tjekker om siden er gyldig: Siden skal være mlelem 1 og totalPages
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // tilføjer/ændrer page i searchparams
      // bruger går til side 2: URL, /products?page=2
      const params = new URLSearchParams(searchParams);
      params.set("page", page.toString());
      // når setsearchparams ændrer URL parametrene kalder useffect automatisk fetchproducts
      setSearchParams(params);
    }
  };

  return (
    <Box p={10} minH="100vh">
      {/* Breadcrumb */}
      <Breadcrumb fontSize="md" spacing="8px" separator="/">
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/">
          <Text fontWeight="bold" color="gray.700">
            Home
            </Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink
            as={Link}
            to="/products/all"
            onClick={() => {
              setSelectedCollections([]);
              setSelectedJewelryTypes([]);
              setSearchParams({});
            }}
          >
           <Text fontWeight="bold" color="gray.700">
            All products
            </Text>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {category && category !== "all" && (
          <BreadcrumbItem isCurrentPage>
            <Text fontWeight="bold" color="gray.700">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </BreadcrumbItem>
        )}
      </Breadcrumb>

      {/* Filter Summary */}
      <Box mb={6} p={4} bg="gray.50" borderRadius="md" boxShadow="sm">
        <Heading as="h3" size="sm" mb={2} color="gray.600">
          Active Filters
        </Heading>
        <Text fontSize="sm" color="gray.600">
          <strong>Jewelry Types:</strong> {selectedJewelryTypes.length > 0 ? selectedJewelryTypes.join(", ") : "None"}
        </Text>
        <Text fontSize="sm" color="gray.600">
          <strong>Collections:</strong> {selectedCollections.length > 0 ? selectedCollections.join(", ") : "None"}
        </Text>
      </Box>

      {/* Layout: Sidebar + Product Grid */}
      <Grid templateColumns={{ base: "1fr", lg: "1fr 3fr" }} gap={10}>
        {/* Sidebar */}
        <Box as="aside" bg="gray.50" p={6} borderRadius="md" boxShadow="md">
          <Heading as="h2" size="md" mb={4}>
            Filter
          </Heading>
          <Box mb={6}>
            <Heading as="h3" size="sm" mb={2} textAlign="left">
              Sort By
            </Heading>
            <RadioGroup value={sortOption} onChange={handleSortChange}>
              <Stack direction="column">
                <Radio value="priceHighToLow">Price High to Low</Radio>
                <Radio value="priceLowToHigh">Price Low to High</Radio>
              </Stack>
            </RadioGroup>
          </Box>

          <Divider my={4} />
          <Box mb={6}>
            <Heading as="h3" size="sm" mb={2} textAlign="left">
              Collections
            </Heading>
            <Stack direction="column">
              {allCollections.map((collection) => (
                <Checkbox
                  key={collection}
                  value={collection}
                  isChecked={selectedCollections.includes(collection)}
                  onChange={(e) => handleCollectionChange(collection, e.target.checked)}
                >
                  {collection}
                </Checkbox>
              ))}
            </Stack>
          </Box>
          <Box>
            <Heading as="h3" size="sm" mb={2} textAlign="left">
              Jewelry Types
            </Heading>
            <Stack direction="column">
              {["necklaces", "earrings", "bracelets", "rings"].map((type) => (
                <Checkbox
                  key={type}
                  value={type}
                  isChecked={selectedJewelryTypes.includes(type)}
                  onChange={(e) => handleJewelryTypeChange(type, e.target.checked)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Checkbox>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Product Grid */}
        <Box as="section">
          <Text mb={4}>
            {totalProducts > 0 ? `${totalProducts} products in total` : "No products found"}
          </Text>

          {/* Produkterne bliver hentet fra backend og gemt i state (products) i Products.tsx. Hvert produkt sendes som props til ProductCard */}
          {/* product indeholder al data som id, name, price, type osv */}
          {/* Hvert objekt i products-arrayet (som kommer fra backend) sendes til ProductCard som en product-prop. */}

          {loading ? (
            <Text>Loading products...</Text>
          ) : (
            <Grid
              templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
              gap={6}
            >
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Grid>
          )}
        </Box>
      </Grid>

      {/* Pagination Controls */}
      <Stack direction="row" spacing={4} mt={6} justify="center">
      <ButtonComponent
          text="Previous"
          variant="primaryBlackBtn"
          onClick={() => handlePageChange(currentPage - 1)}
          hoverStyle={{ opacity: 0.8 }}
      />
        <Text>{`${currentPage} of ${totalPages}`}</Text>
      <ButtonComponent
          text="Next"
          variant="primaryBlackBtn"
          onClick={() => handlePageChange(currentPage + 1)}
          hoverStyle={{ opacity: 0.8 }}
      />
      </Stack>
    </Box>
  );
};

export default Products;
