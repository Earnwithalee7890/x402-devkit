;; api-registry.clar
;; On-chain registry for Conduit APIs

(define-map apis
  { id: uint }
  {
    name: (string-ascii 64),
    slug: (string-ascii 64),
    price: uint,
    provider: principal,
    active: bool,
    metadata-url: (string-ascii 256)
  }
)

(define-data-var last-api-id uint u0)

;; Public functions
(define-public (register-api (name (string-ascii 64)) (slug (string-ascii 64)) (price uint) (metadata-url (string-ascii 256)))
  (let
    (
      (id (+ (var-get last-api-id) u1))
    )
    (map-set apis { id: id }
      {
        name: name,
        slug: slug,
        price: price,
        provider: tx-sender,
        active: true,
        metadata-url: metadata-url
      }
    )
    (var-set last-api-id id)
    (ok id)
  )
)

(define-read-only (get-api (id uint))
  (map-get? apis { id: id })
)
