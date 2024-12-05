Project Overview
Project Name: JewelryShop Web App

Overview
JewelryShop er en moderne e-commerce webapplikation designet til at fremvise og sælge smykker. Applikationen inkluderer funktioner som brugerautentifikation, dynamiske produktlister, et adminpanel til produktadministration og et fuldt responsivt design. Projektet er bygget med MERN-stacken og implementerer moderne udviklingsprincipper samt en brugervenlig UI.

Key Features
User Authentication:
Login/Logout: Brugere kan registrere sig, logge ind og logge ud.
Sikkerhed: JWT-baseret autentifikation med tokenlagring i localStorage.
Profil: Brugerinformation vises på profil-siden.
Beskyttede ruter: Begrænset adgang til bruger- og adminspecifikke data via middleware.

Admin Panel:
    Produktadministration:
        Tilføj, opdater og slet produkter.
        Upload flere billeder pr. produkt og automatisk sletning af billeder ved produkt-sletning.
    Produktliste:
        Dynamisk tabel over produkter, sorteret efter senest tilføjet.
        Scroll-funktion for bedre håndtering af mange produkter.
    Beskyttet adgang: Admin-ruter sikret med middleware for rollebaseret kontrol.
Product Features:
Dynamiske kategorier: Kategorier som Rings, Necklaces, Bracelets, og Earrings.
Produktdetaljer: Individuelle sider for hvert produkt med relevante informationer.
Filtrering og sortering: Sorter produkter efter pris og filtrer baseret på kategori eller kollektion.
Case-insensitive matching: Matcher produkt-typer og kollektioner uafhængigt af store/små bogstaver.

Navigation:
Responsivt design: Responsiv navbar, der opdateres baseret på login-status.
Mobilvenlig navigation: Drawer-baseret navigation for mobilbrugere.

Cart and Checkout:
    Dynamisk kurv:
        Tilføj, fjern og opdater produktmængder i kurven.
        Badge opdateres i realtid med det samlede antal varer.
    Checkout flow:
        Valg mellem hjemmelevering eller afhentning ved pakkeshop.
        Integration med Stripe for sikker betaling.
        Ordrebekræftelse sendt via email efter succesfuld checkout.
My Account Section:
    Orders Tab:
        Viser tidligere ordrer med status som In Progress, Completed og Return.
        Mulighed for at starte returneringer med automatiserede emailnotifikationer.
    Favourites Tab:        
        Viser favoritprodukter og tillader fjernelse af dem.
    User Information Tab:
        Brugere kan opdatere deres oplysninger som navn og email.
        Mulighed for at ændre password.


Current Progress
Authentication:
Sikker registrering, login og logout implementeret.
Brug af bcrypt til password hashing og JWT til session-håndtering.
Testet autentifikationsendpoints med Postman.
Dynamisk opdatering af navbar baseret på login-status.

Admin Panel:
Fuldt funktionelt adminpanel med beskyttede ruter.
CRUD-operationer for produkter.
Automatisk håndtering af billedfiler under oprettelse og sletning.

Frontend:
    Skabte sider:
        Forside
        Login-side
        Signup-side
        Profil-side (med Orders, Favourites og User Info tabs)
        Produktsider med dynamiske kategorier og filtrering
        Admin-sider til produkt- og ordreadministration
        Kurvsider med interaktive mængdeopdateringer
        Checkout-flow med leverings- og betalingsmuligheder
        Fuldt responsivt design ved hjælp af Chakra UI.
    Backend:
    Database: Tilsluttet MongoDB Atlas.
    API-endpoints: Implementeret for brugere, produkter, kurv og ordrer.
        Middleware:    
            JWT-validering for sessioner.
            Rollebaseret kontrol for admin-specifikke ruter.
    Integrationer: Stripe til betaling og Nodemailer til emailbekræftelser.
    Filhåndtering: Upload af billeder og automatisk sletning af relaterede filer.
    Testet API-endpoints med Postman og sikret fuld integration med frontend.

Technologies Used:
Frontend: React.js, TypeScript, Chakra UI
Backend: Node.js, Express.js, MongoDB
Andre: Postman, Axios, JWT, bcrypt, Stripe, Nodemailer

