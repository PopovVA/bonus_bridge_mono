import Link from 'next/link'
import { Tag } from 'lucide-react'

type CouponCardProps = {
  id: string
  title: string
  previewText: string
  couponCode?: string | null
  referralUrl: string
  storeName?: string
  logoSvg?: string | null
}

export function CouponCard({
  id,
  title,
  previewText,
  couponCode,
  logoSvg
}: CouponCardProps) {
  const discountLabel = couponCode ? couponCode : title

  return (
    <div className="coupon-card">
      <Link href={`/coupons/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="coupon-card-image">
          {logoSvg ? (
            <div
              dangerouslySetInnerHTML={{ __html: logoSvg }}
              style={{
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            />
          ) : (
            <div className="coupon-card-image-placeholder" />
          )}
        </div>
        <div className="coupon-card-body">
          <div className="coupon-card-discount">
            <Tag className="coupon-card-discount-icon" size={16} />
            <span className="coupon-card-discount-text">{discountLabel}</span>
          </div>
          <p className="coupon-card-conditions">{previewText}</p>
          <span className="coupon-card-btn" style={{ display: 'block', textAlign: 'center' }}>
            Get Code
          </span>
        </div>
      </Link>
    </div>
  )
}
