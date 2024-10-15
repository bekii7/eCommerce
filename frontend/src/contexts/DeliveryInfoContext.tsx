import React, { createContext, useContext, useState, useEffect } from "react";
import { DeliveryInfo } from "../types";
import { getDeliveryInfo } from "../api";
import { useSupabase } from "../hooks/useSupabase";

type DeliveryInfoContextType = {
  savedDeliveryInfos: DeliveryInfo[];
  isLoading: boolean;
  error: string | null;
  triggerRefresh: () => void;
};

const DeliveryInfoContext = createContext<DeliveryInfoContextType | undefined>(
  undefined
);

export const useDeliveryInfoContext = () => {
  const context = useContext(DeliveryInfoContext);
  if (!context) {
    throw new Error(
      "useDeliveryInfoContext must be used within a DeliveryInfoProvider"
    );
  }
  return context;
};

export const DeliveryInfoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [savedDeliveryInfos, setSavedDeliveryInfos] = useState<DeliveryInfo[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Refresh trigger

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1); // Increment the refreshKey to trigger refetch

  const { authenticated } = useSupabase();

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        setIsLoading(true);
        if (authenticated) {
          const response = await getDeliveryInfo();

          const resData = await response.json();
          if (!response.ok) {
            throw new Error(resData.message);
          }

          setSavedDeliveryInfos(
            resData.data.map((info: DeliveryInfo) => ({
              ...info,
              deliveryInstructions: "",
            }))
          );
        } else {
          setSavedDeliveryInfos([]);
        }
      } catch (e) {
        setError("Failed to load saved delivery infos.");
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryInfo();
  }, [refreshKey, authenticated]); // Refetch when refreshKey changes

  return (
    <DeliveryInfoContext.Provider
      value={{ savedDeliveryInfos, isLoading, error, triggerRefresh }}
    >
      {children}
    </DeliveryInfoContext.Provider>
  );
};
