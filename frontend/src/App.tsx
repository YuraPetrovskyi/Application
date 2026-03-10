import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AssistantDrawer from "./components/AssistantDrawer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsListPage from "./pages/EventsListPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CreateEventPage from "./pages/CreateEventPage";
import EditEventPage from "./pages/EditEventPage";
import MyEventsPage from "./pages/MyEventsPage";
import { useAppDispatch, useAppSelector } from "./hooks/useAppStore";
import { fetchMe } from "./store/slices/authSlice";
import LoadingSpinner from "./components/LoadingSpinner";

function AppRoutes() {
  const dispatch = useAppDispatch();
  const { token, user, initializing } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, []);

  if (initializing) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <AssistantDrawer />
      <main>
        <Routes>
          <Route path="/" element={<EventsListPage />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <RegisterPage />}
          />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route
            path="/events/create"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute>
                <EditEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-events"
            element={
              <ProtectedRoute>
                <MyEventsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
