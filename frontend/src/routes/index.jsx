import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

const Routing = () => {
  const Login = lazy(() => import("../pages/login"));
  const Registration = lazy(() => import("../pages/registration"));
  const Layout = lazy(() => import("../container/layout"));
  const Dashboard = lazy(() => import("../pages/dashboard"));
  const NFT = lazy(() => import("../pages/nft"));
  const Bridge = lazy(() => import("../pages/bridge"));
  const Purchase = lazy(() => import("../pages/purchase"));
  const BusinessLogin = lazy(()=> import("../pages/businesslogin"));
  const BusinessRegistration = lazy(()=>import("../pages/businessregistration"));
  const BusinessDashboard = lazy(()=>import("../pages/businessdashboard"));



  return (
    <Suspense >
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/businesslogin" element={<BusinessLogin/>}/>
        <Route path="/businessregistration" element={<BusinessRegistration/>}/>

        <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nft" element={<NFT />} />
        <Route path="/bridge" element={<Bridge />} />
        <Route path="/purchase/:id" element={<Purchase />} />
        <Route path="/businessdashboard" element={<BusinessDashboard/>}/>
        
        </Route>
      </Routes>


    </Suspense>
  )
}

export default Routing;