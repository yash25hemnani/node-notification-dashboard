import React from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

interface AppTabsProps {
  tabs: TabItem[];
  queryKey?: string; // default: "tab"
  className?: string;
  listClassName?: string;
}

export function AppTabs({
  tabs,
  queryKey = "tab",
  className,
  listClassName,
}: AppTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  if (!tabs.length) return null;

  const activeTab =
    searchParams.get(queryKey) &&
    tabs.some((t) => t.value === searchParams.get(queryKey))
      ? searchParams.get(queryKey)!
      : tabs[0].value;

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(queryKey, value);
    setSearchParams(params);
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className={className || "w-full"}
    >
      <TabsList
        className={listClassName || "grid mx-auto w-100"}
        style={{
          gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
        }}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="px-8 text-sm hover:cursor-pointer"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
