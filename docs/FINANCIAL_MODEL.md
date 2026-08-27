# Financial model

Amounts retain `original_amount`, `original_currency`, `exchange_rate`, `base_amount` and `base_currency`; rates are timestamped and frozen at business events. Pricing returns an explainable, versioned snapshot containing selected contract/rate, promotions, taxes, markup, commission and cancellation conditions. Booking conversion copies the approved quote snapshot and never recalculates it retrospectively.

Payment allocation, invoices, credit notes and supplier invoices become auditable subledger events. Later general-ledger integration consumes immutable postings rather than rewriting tourism transactions.
