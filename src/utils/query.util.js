import { getPaginationParams } from './pagination.util.js';

export const buildQueryOptions = (req, allowedFilters = [], searchFields = []) => {
    // 1. Ambil Parameter Pagination
    const { page, limit, skip } = getPaginationParams(req);

    // 2. Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "desc" ? "desc" : "asc";

    // 3. Filtering
    const where = {};
    allowedFilters.forEach((field) => {
        const value = req.query[field];

        if (value) {
            if (field === 'year') {
                where[field] = parseInt(value);
            } else {
                where[field] = value;
            }
        }
    });

    // 4. Searching
    if (req.query.search && searchFields.length > 0) {
        where.OR = searchFields.map((f) => ({
            [f]: {
                contains: req.query.search,
            },
        }));
    }

    return {
        skip,
        take: limit, 
        paginationMeta: { page, limit },
        orderBy: { [sortBy]: order },
        where,
    };
};