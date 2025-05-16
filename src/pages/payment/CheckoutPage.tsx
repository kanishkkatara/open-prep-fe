// src/pages/payment/CheckoutPage.tsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";
import LoadingScreen from "../../components/ui/LoadingScreen";
import { fetchPlans } from "../../lib/api";
import type { Plan } from "../../lib/types";
import toast from "react-hot-toast";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const planId = params.get("planId");
    if (!planId) {
      // no planId → back to pricing
      navigate("/app/pricing", { replace: true });
      return;
    }

    fetchPlans()
      .then((plans) => {
        const found = plans.find((p) => p.id === planId);
        if (!found) throw new Error("Plan not found");
        setPlan(found);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [search, navigate]);

  if (!plan) {
    return <LoadingScreen />;
  }

  return (
    <CheckoutForm
      plan={plan}
      onBack={() => navigate("/app/pricing")}
    />
  );
};

export default CheckoutPage;
