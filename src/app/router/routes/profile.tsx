import { redirect, RouteObject } from "react-router";
import OwnProducts from "../../../components/Profile/Products/OwnProducts";
import ProfileTabs from "../../../components/Profile/ProfileTabs";
import Settings from "../../../components/Profile/Settings/Settings";
import Transactions from "../../../components/Profile/Transactions/Transactions";
import { authGuard } from "../../guards/auth";
import { get } from "../../../util/requests/requests";

export const profileRoutes: RouteObject = {
    path: 'profile',
    loader: authGuard,
    children: [
        {
            path: '',
            loader: () => {
                return redirect('products');
            }
        },
        {
            path: 'products',
            element: (
                <>
                    <ProfileTabs currentTab={0} />
                    <OwnProducts />
                </>
            ),
            loader: async ({ request }) => {
                const url = new URL(request.url);
                const page = url.searchParams.get('page');
                const sort = url.searchParams.get('sort');
                const by = url.searchParams.get('by');

                if (!page) {
                    url.searchParams.append('page', '1');
                }

                if (!sort || !by) {
                    url.searchParams.append('sort', 'asc');
                    url.searchParams.append('by', 'name');
                }

                const search = url.search;

                const { data } = await get('/product/own' + search);

                return data;
            }
        },
        {
            path: 'purchases',
            element: (
                <>
                    <ProfileTabs currentTab={1} />
                    <Transactions />
                </>
            ),
            loader: async () => {
                const { data } = await get('/user/transactions');
                return data;
            },
        },
        {
            path: 'settings',
            element: (
                <>
                    <ProfileTabs currentTab={2} />
                    <Settings />
                </>
            )
        }
    ],
};