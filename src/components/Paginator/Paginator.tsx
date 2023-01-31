import { Pagination, PaginationItem, PaginationRenderItemParams, Stack } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";

/**
 * ```typescript
 * interface IPaginator {
 *  total: number;
 *  endpoint: 'search' | 'all';
 * }
 * ```
 */
export interface IPaginator {
    total: number;
    endpoint: 'search' | 'all' | 'own';
}

/**
 * Use this to inject pagination. Each page holds no more than six products.
 * **Note:** this component uses query strings.
 */
export const Paginator = (props: IPaginator) => {
    const [searchParams] = useSearchParams();
    if (props.total <= 6) {
        return null;
    }
    const page = Number(searchParams.get('page')) || 1;
    const pages = Math.ceil(props.total / 6);
    const sort = searchParams.get('sort');
    const by = searchParams.get('by');

    const sortBy = (sort && by) ? `&sort=${sort}&by=${by}` : '';
    /**
     * Use this to inject appropriate URL page, depending on whether this is a list of search results
     * or a list of all products. ``item`` 
     * should be passed from the ``renderItem`` callback in ``PaginationItem``
     */
    function to(endpoint: 'search' | 'all' | 'own', item: PaginationRenderItemParams) {
        if (endpoint === 'search') {
            return `/product/search?name=${searchParams.get('name')}&page=${item.page}${sortBy}`;
        }

        if (endpoint === 'own') {
            return `/profile/products?page=${item.page}${sortBy}`;
        }
        return `/product/all?page=${item.page}${sortBy}`;
    }
    
    return (
        <Stack justifyContent="center" direction="row">
                <Pagination
                    color="primary"
                    count={pages}
                    page={page}
                    renderItem={(item) => (
                        <PaginationItem
                            component={Link}
                            to={to(props.endpoint, item)}
                            {...item}
                        />
                    )}
                />
            </Stack>
    );
}