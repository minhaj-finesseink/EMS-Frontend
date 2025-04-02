import React, { useState } from "react";
import CustomButton from "../../../../../components/CustomButton";
import CheckIcon from "../../../../../assets/NewIcons/Check icon.svg";
import Check2Icon from "../../../../../assets/NewIcons/Check icon-2.svg";
import "./style.css";

const plans = [
  {
    title: "Basic plan",
    price: "Free",
    features: [
      "Meetings up to 40 mins",
      "Up to 10 participants per meeting",
      "Video clarity : 720p HD",
      "Team chat & reactions",
      "End to end encryption",
      "Whiteboard basic",
      "Email support",
    ],
    buttonText: "Selected",
    buttonStyle: "btn-selected",
    planStyle: "basic-plan",
  },
  {
    title: "Premium plan",
    price: "$100/year",
    features: [
      "Meetings duration : Unlimited",
      "Up to 100 participants per meeting",
      "Video clarity : 1080p full HD",
      "Cloud & local recording",
      "Advanced security",
      "API & integration",
      "Email support",
    ],
    buttonText: "Upgrade",
    buttonStyle: "btn-upgrade",
    planStyle: "premium-plan",
  },
  {
    title: "Custom plan",
    price: "Custom (Price varies)",
    features: [
      "Meetings duration : Unlimited",
      "Unlimited participants",
      "Dedicated servers & security",
      "Custom branding",
      "Advanced analytics",
      "API & integration",
      "Premium support",
    ],
    buttonText: "Contact Sales",
    buttonStyle: "btn-contact",
    planStyle: "custom-plan",
  },
];

function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState("annual");
  return (
    <div className="pricing-container">
      <div className="plan-card-header">
        <div>Choose your plan</div>
        <div className="plan-toggle">
          <button
            className={selectedPlan === "monthly" ? "active" : ""}
            onClick={() => setSelectedPlan("monthly")}
          >
            Monthly
          </button>
          <button
            className={selectedPlan === "annual" ? "active" : ""}
            onClick={() => setSelectedPlan("annual")}
          >
            Annual
          </button>
        </div>
      </div>
      <div className={`plan-card-container`}>
        {plans.map((plan, index) => (
          <div key={index} className={`plan-card ${plan.planStyle}`}>
            <div className="plan-title">{plan.title}</div>
            {/* <div className="plan-price">{plan.price}</div> */}
            <div className="plan-price">
              {plan.title === "Custom plan" ? (
                <>
                  Custom <span className="price-varies">(Price varies)</span>
                </>
              ) : (
                plan.price
              )}
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, i) => (
                <li key={i}>
                  {plan.planStyle === "premium-plan" ? (
                    <img src={Check2Icon} alt="check icon" />
                  ) : (
                    <img src={CheckIcon} alt="check icon" />
                  )}
                  {feature}
                </li>
              ))}
            </ul>
            {/* <button className={`plan-button ${plan.buttonStyle}`}>
              {plan.buttonText}
            </button> */}

            {plan.planStyle === "basic-plan" ? (
              <CustomButton
                style={{
                  height: "38px",
                  color: "#007DC5",
                  border: "1px solid #007DC5",
                  fontSize: "14px",
                  fontWeight: 700,
                }}
                transparent
                block
              >
                {plan.buttonText}
              </CustomButton>
            ) : (
              <CustomButton
                style={{ height: "38px", fontSize: "14px", fontWeight: 700 }}
                block
                color="blue"
              >
                {plan.buttonText}
              </CustomButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingPlans;
