import React from 'react';
import FrontpageHeroVideo from '../components/frontpage_components/FrontpageHeroVideo';
import FrontpageLinkSection from '../components/frontpage_components/FrontpageLinkSection';
import FrontpageEcofriendly from '../components/frontpage_components/FrontpageEcofriendly';
import FrontpageImageSection from '../components/frontpage_components/FrontpageImageSection';
// import FrontpageTrustpilot from '../components/frontpage_components/FrontpageTrustpilot';
// import ExampleUsage from '../components/frontpage_components/ExampleUsage';

const Frontpage: React.FC = () => {
  return (
    <>
      <FrontpageHeroVideo />
      <FrontpageLinkSection />
      <FrontpageEcofriendly />
      <FrontpageImageSection />
      {/* <FrontpageTrustpilot /> */}
      {/* Til test af shared components. Udkommentér når det er færdigtestet */}
      {/* <ExampleUsage/> */}
    </>
  );
};

export default Frontpage;
