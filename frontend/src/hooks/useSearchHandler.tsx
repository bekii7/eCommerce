import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useSearchHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchTerm);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) navigate(`/products?search=${searchQuery}`);
  };

  return { searchQuery, setSearchQuery, handleSubmit };
};
