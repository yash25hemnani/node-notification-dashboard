import { Search } from "lucide-react";
import { Box } from "./box";
import { Input } from "./input";

const SearchBar = () => {
  return (
    <Box className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search templates..." className="pl-9" />
    </Box>
  );
};

export default SearchBar;
