export const openFile = (path: string, source: "upload" | "local") => {
  let openPath: string;

  if (source === "upload") {
    openPath = `${import.meta.env.VITE_FILE_URL}${path}`;
  } else {
    // Convert local path to backend proxy URL
    openPath = `${import.meta.env.VITE_API_URL}/open-file?path=${encodeURIComponent(path)}`;
  }

  window.open(openPath, "_blank");
};