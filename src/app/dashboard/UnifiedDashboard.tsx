'use client';
import React, { FunctionComponent, useEffect, useState } from "react";
import { useAppSelector } from "@/Redux/Hooks";

const UnifiedDashboard = () => {
  const [DashboardComponent, setDashboardComponent] = useState<FunctionComponent | null>(null);
  const userType = useAppSelector((state) => state.auth.userType);

  useEffect(() => {
    const loadDashboardComponent = async () => {
      let newComponent: () => React.JSX.Element;

      switch (userType) {
        case 'superuser':
          newComponent = (await import('@/sections/blog/view')).PostListView;
          break;
     
      }

      setDashboardComponent(() => newComponent);
    };

    loadDashboardComponent();
  }, [userType]);

  return DashboardComponent ? <DashboardComponent /> : <div>Loading...</div>;
};

export default UnifiedDashboard;