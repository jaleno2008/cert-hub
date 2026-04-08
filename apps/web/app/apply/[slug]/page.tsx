import { redirect } from "next/navigation"

type ApplySlugPageProps = {
  params: {
    slug: string
  }
}

export default function ApplySlugPage({ params }: ApplySlugPageProps) {
  redirect("/apply")
}