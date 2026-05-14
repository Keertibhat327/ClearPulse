export const getInitials = (name: string) => {
    if (!name) return "";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
