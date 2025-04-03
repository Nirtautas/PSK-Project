import LoginPage from "@/components/pages/LoginPage"
import GuestNavBarLayout from "@/components/templates/GuestNavBarLayout"

const Page = () => {
    return (
        <GuestNavBarLayout>
            <LoginPage />
        </GuestNavBarLayout>
    )
}

export default Page