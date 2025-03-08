const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", { day: "numeric", month: "long"});
};

export { formatDate }; // export the function