;; subscription-manager.clar
;; Prepaid credits and subscription plans

(define-map user-credits principal uint)

(define-public (purchase-credits (amount uint))
  (begin
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (let
      (
        (current (default-to u0 (map-get? user-credits tx-sender)))
        (bonus (calculate-bonus amount))
      )
      (map-set user-credits tx-sender (+ current amount bonus))
      (ok true)
    )
  )
)

(define-private (calculate-bonus (amount uint))
  ;; 10% bonus for over 100 STX
  (if (>= amount u100000000)
    (/ amount u10)
    u0
  )
)

(define-read-only (get-credits (user principal))
  (default-to u0 (map-get? user-credits user))
)
