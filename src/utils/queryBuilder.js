export const buildQueryOptions = (req, allowedFilters = [], searchFields = []) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const skip = (page - 1) * limit;

  // Sorting
  const sortBy = req.query.sortBy || "createdAt";
  const order = req.query.order === "desc" ? "desc" : "asc";

  // Filtering (only allow specific fields)
  const where = {};
  allowedFilters.forEach((field) => {
    if (req.query[field]) {
      where[field] = req.query[field];
    }
  });

  // Searching (case insensitive)
  if (req.query.search && searchFields.length > 0) {
    where.OR = searchFields.map((f) => ({
      [f]: {
        contains: req.query.search,
        mode: "insensitive",
      },
    }));
  }

  return {
    pagination: { page, limit, skip },
    orderBy: { [sortBy]: order },
    where,
  };
};
