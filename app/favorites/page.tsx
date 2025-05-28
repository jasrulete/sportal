import EmptyState from "../Components/EmptyState";
import ClientOnly from "../Components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListings";
import FavoritesClient from "./FavoritesClient";
import FeedbackComponent from "../Components/Feedback";


const ListingPage = async () => {
    const listings = await getFavoriteListings();
    const currentUser = await getCurrentUser();

    if(listings.length === 0){
        return (
            <ClientOnly>
                <EmptyState
                    title="No favorites found"
                    subtitle="Looks like you have no favorite listings"
                />
                <FeedbackComponent />
            </ClientOnly>
        )
    }

    return (
        <ClientOnly>
            <FavoritesClient
                listings={listings}
                currentUser={currentUser}
            />
            <FeedbackComponent />
        </ClientOnly>
    )

}

export default ListingPage;