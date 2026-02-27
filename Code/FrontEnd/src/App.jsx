import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import RecipesAdd from "./pages/RecipesAdd";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecipeDetail from "./pages/RecipeDetail";
import Profile from "./pages/Profile";
import ErrorPage from "./pages/ErrorPage";
import Search from "./pages/Search";
import EditProfile from "./pages/EditProfile";
import EditCookpadid from "./pages/EditCookpadid";
import EmailChange from "./pages/EmailChange";
import EmailChangeRequest from "./pages/EmailChangeRequest";
import Stactistical from "./pages/Stactistical";
import User from "./pages/User";
import Library from "./pages/Library";
import Inbox from "./pages/Inbox";
import Report from "./pages/Report";
import CategoryPage from "./pages/CategoryPage";

// Admin

import AdminLayout from "./admin/layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Recipes from "./admin/pages/Recipes";
import Users from "./admin/pages/Users";
import Comments from "./admin/pages/Comments";
import AdminLogin from "./admin/pages/AdminLogin";
import ProtectedAdminRoute from "./admin/middlewares/ProtectedAdminRoute";
import PublicAdminRoute from "./admin/middlewares/PublicAdminRoute";
import ResetPassword from "./pages/ResetPassword";
import UpdateRecipe from "./pages/UpdateRecipe";
import Categories from "./admin/pages/Categories";
import CategoriesList from "./pages/CategoriesList.jsx";
import IngredientSuggest from "./pages/IngredientSuggestPage.jsx";
import NutritionCategories from "./components/NutritionCategories.jsx";
import NutritionCategoryPage from "./pages/NutritionCategoryPage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "recipe/add",
        element: <RecipesAdd />,
      },
      {
        path: "category/:id",
        element: <CategoryPage />,
      },
      {
        path: "categories",
        element: <CategoriesList />,
      },
      {
        path: "nutrition",
        element: <NutritionCategories />,
      },
      {
        path: "nutrition/:key",
        element: <NutritionCategoryPage />,
      },
      {
        path: "suggest",
        element: <IngredientSuggest />,
      },
      {
        path: "recipe/:id/update",
        element: <UpdateRecipe />,
      },
      {
        path: "recipes/:id",
        element: <RecipeDetail />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "profile/:id",
        element: <Profile />,
      },
      {
        path: "editProfile",
        element: <EditProfile />,
      },
      {
        path: "editCookpadid",
        element: <EditCookpadid />,
      },
      {
        path: "emailChange",
        element: <EmailChange />,
      },
      {
        path: "emailChangeRequest/verifications",
        element: <EmailChangeRequest />,
      },
      {
        path: "password",
        element: <ResetPassword />,
      },
      {
        path: "stactistical",
        element: <Stactistical />,
      },
      {
        path: "me/library",
        element: <Library />,
      },
      {
        path: "me/inbox",
        element: <Inbox />,
      },
      {
        path: "me/recipe/report",
        element: <Report />,
      },
      {
        path: "user/search",
        element: <User />,
      },
      {
        path: "search",
        element: <Search />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "recipes", element: <Recipes /> },
      { path: "users", element: <Users /> },
      { path: "comments", element: <Comments /> },
      { path: "categories", element: <Categories /> },
    ],
  },
  {
    path: "/admin/login",
    element: (
      <PublicAdminRoute>
        <AdminLogin />
      </PublicAdminRoute>
    ),
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
