import React from 'react';
import FrontpageHeroVideo from '../components/frontpage_components/FrontpageHeroVideo';
import FrontpageLinkSection from '../components/frontpage_components/FrontpageLinkSection';
import FrontpageEcofriendly from '../components/frontpage_components/FrontpageEcofriendly';
import FrontpageImageSection from '../components/frontpage_components/FrontpageImageSection';
import FrontpageTrustpilot from '../components/frontpage_components/FrontpageTrustpilot';

const Frontpage: React.FC = () => {
  return (
    <>
      <FrontpageHeroVideo />
      <FrontpageLinkSection />
      <FrontpageEcofriendly />
      <FrontpageImageSection />
      <FrontpageTrustpilot />
    </>
  );
};

export default Frontpage;
