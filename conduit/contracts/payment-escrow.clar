;; payment-escrow.clar
;; Escrow and settlement for x402 payments

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_EXPIRED (err u101))

(define-map escrow-payments
  { payment-id: (buff 32) }
  {
    amount: uint,
    payer: principal,
    provider: principal,
    expiry: uint,
    status: (string-ascii 16) ;; "pending", "settled", "disputed"
  }
)

(define-public (create-payment (payment-id (buff 32)) (amount uint) (provider principal) (expiry uint))
  (begin
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set escrow-payments { payment-id: payment-id }
      {
        amount: amount,
        payer: tx-sender,
        provider: provider,
        expiry: expiry,
        status: "pending"
      }
    )
    (ok true)
  )
)

(define-public (settle-payment (payment-id (buff 32)))
  (let
    (
      (payment (unwrap! (map-get? escrow-payments { payment-id: payment-id }) (err u404)))
    )
    (asserts! (is-eq (get status payment) "pending") (err u102))
    ;; In a real facilitator scenario, this would be authorized by the provider's signature
    (try! (as-contract (stx-transfer? (get amount payment) (as-contract tx-sender) (get provider payment))))
    (map-set escrow-payments { payment-id: payment-id }
      (merge payment { status: "settled" })
    )
    (ok true)
  )
)
