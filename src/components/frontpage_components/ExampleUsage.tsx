import ButtonComponent from "../shared/ButtonComponent";

const ExampleUsage = () => {
  return (
    <div>
      {/* Primary Button (Green) */}
      <ButtonComponent text="Go to bakset" variant="primaryGreenBtn" onClick={() => console.log("PrimaryGreen")} />

      {/* Primary Button (Black) */}
      <ButtonComponent text="Add to basket" variant="primaryBlackBtn" onClick={()=> console.log("PrimaryBlack")}/>

      {/* CTA button (Bordeaux Red) */}
      <ButtonComponent text="Buy now" variant="ctaBtn" onClick={()=> console.log("CTAbtn")}/>

      {/* Grey Button */}
      <ButtonComponent text="Edit/Cancel" variant="greyBtn" onClick={() => console.log("Grey button")} />

      {/* Red Button */}
      <ButtonComponent text="Delete" variant="redBtn" onClick={() => console.log("Red button")} />

      {/* Green Button */}
      <ButtonComponent text="Save" variant="greenBtn" onClick={() => console.log("Green button")}/>

      {/* Outline Button */}
      <ButtonComponent text="Learn More" variant="outlineBtn" onClick={() => console.log("Outline")} />
    </div>
  );
};

export default ExampleUsage;
