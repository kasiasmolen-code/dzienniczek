import { verifyAuth, handleApiError, supabaseAdmin } from '@/lib/api/middleware'
import { z } from 'zod'

const ADMIN_EMAIL = 'katarzynasmolen1@gmail.com'

const schema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  greeting_prompt: z.string().optional(),
  system_prompt: z.string().optional(),
  shopify_product_id: z.string().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyAuth(req)
    const admin = supabaseAdmin()

    const { data: authUser } = await (admin as any).auth.getUser(
      req.headers.get('authorization')?.slice(7) ?? ''
    )
    if (authUser?.user?.email !== ADMIN_EMAIL) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const updates = schema.parse(body)

    const { data, error } = await (admin as any)
      .from('therapists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return Response.json(data)
  } catch (e) {
    return handleApiError(e)
  }
}
