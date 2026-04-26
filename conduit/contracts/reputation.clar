;; reputation.clar
;; Rating system for API providers

(define-map provider-stats
  principal
  {
    total-ratings: uint,
    rating-sum: uint,
    tier: (string-ascii 16)
  }
)

(define-public (rate-provider (provider principal) (rating uint))
  (begin
    (asserts! (and (>= rating u1) (<= rating u5)) (err u103))
    (let
      (
        (current-stats (default-to { total-ratings: u0, rating-sum: u0, tier: "New" } (map-get? provider-stats provider)))
        (new-total (+ (get total-ratings current-stats) u1))
        (new-sum (+ (get rating-sum current-stats) rating))
      )
      (map-set provider-stats provider
        {
          total-ratings: new-total,
          rating-sum: new-sum,
          tier: (calculate-tier new-total)
        }
      )
      (ok true)
    )
  )
)

(define-private (calculate-tier (total uint))
  (if (>= total u100) "Platinum"
  (if (>= total u50) "Gold"
  (if (>= total u20) "Silver"
  (if (>= total u5) "Bronze" "New"))))
)
