use scrypto::prelude::*;

blueprint! {
    struct Bralls {
        bra_tokens: Vault,
        collected_xrd: Vault,
        price: Decimal,
        fee: Decimal,
    }

    impl Bralls {

        pub fn instantiate_bralls(
                bra_initial_supply: Decimal,
                fee:Decimal,
                price: Decimal,
            ) -> ComponentAddress {
                let bucket_of_bra = ResourceBuilder::new_fungible()
                    .divisibility(DIVISIBILITY_MAXIMUM)
                    .metadata("name", "Bralls")
                    .metadata("symbol", "BRA")
                    .initial_supply(bra_initial_supply);
                Self {
                    bra_tokens: Vault::with_bucket(bucket_of_bra),
                    collected_xrd: Vault::new(RADIX_TOKEN),
                    price,
                    fee,
                }.instantiate().globalize()
        }

        pub fn swap_xrd_for_bra(&mut self, input:Decimal, mut xrd:Bucket) -> (Bucket, Bucket){
            let input_price:Decimal = self.price / 2;
            let value_input_bra:Decimal = input * input_price;
            let take_xrd:Decimal = value_input_bra / self.price;

            self.collected_xrd.put(xrd.take(take_xrd));

            let fee_amount:Decimal = take_xrd * self.fee;
            let amount = take_xrd - fee_amount;

            let value_input_xrd:Decimal = amount * self.price;
            let take_bra:Decimal = value_input_xrd / input_price;

            (self.bra_tokens.take(take_bra), xrd)
        }

    }
}
