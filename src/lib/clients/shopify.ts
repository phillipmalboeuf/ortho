


async function request<T>(fetch, query: string, variables?: {[key:string]: any}): Promise<{ data: T, errors: { message: string }[] }> {

  let res = await fetch(
    'https://orthografica.myshopify.com/api/2022-01/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': '18e7368a803d07f5769e52d186755122'
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
  const json = await res.json()
  console.log(json)
  return json
}

export interface VariantDocument {
  title: string
  priceV2: {
    amount: number
  }
  compareAtPriceV2: {
    amount: number
  }
  weight: number
  id: string
  sku: string
  outOfStock: boolean
  selectedOptions: {[key: string]: string}
}

export interface ProductDocument {
  variants: { edges: { node: VariantDocument }[] }
  options: { name: string, values: string[] }[]
  title: string
  handle: string
  id: string
  availableForSale: boolean
  productType: string
  priceRange: {
    maxVariantPrice: {
      amount: number
    }
    minVariantPrice: {
      amount: number
    }
  }
}

export const products = async (fetch) => {
  return (await request<{
    shop: {
      products: {
        edges: { node: ProductDocument }[]
      }
    }
  }>(fetch, `
    query {
      shop {
        products(first: 20) {
          edges {
            node {
              title
              id
              handle
            }
          }
        }
      }
    }
  `)).data.shop.products.edges.map(e => e.node)
}

export const getProduct = async (fetch, id: string) => {
  const product = (await request<{
    product: ProductDocument
  }>(fetch, `
    query {
        product(id: "${id}") {
          title
          id
          handle
          availableForSale
          productType
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first:20) {
            edges {
              node {
                id
                sku
                title
                weight
                availableForSale
                quantityAvailable
                compareAtPriceV2 {
                  amount
                  currencyCode
                }
                priceV2 {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      
    }
  `)).data.product
  return {
    ...product,
    // variants: product.variants.edges?.map(e => e.node)
  }
}

const cartNode = `{
  id
  checkoutUrl
  estimatedCost {
    totalAmount {
      amount
    }
    subtotalAmount {
      amount
    }
    totalTaxAmount {
      amount
    }
  }
  discountCodes {
    applicable
    code
  }
  lines(first:20) {
    edges {
      node {
        id
        quantity
        attributes {
          key
          value
        }
        estimatedCost {
          totalAmount {
            amount
          }
          subtotalAmount {
            amount
          }
        }
        discountAllocations {
          discountedAmount {
            amount
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            sku
            weight
            selectedOptions {
              name
              value
            }
            priceV2 {
              amount
            }
            compareAtPriceV2 {
              amount
            }
            product {
              title
              id
              handle
            }
          }
        }
      }
    }
  }
}`


export interface LineDocument {
  id: string
  quantity: number
  estimatedCost: {
    totalAmount: {
      amount: number
    }
    subtotalAmount: {
      amount: number
    }
  }
  discountAllocations: {
    discountedAmount: {
      amount: number
    }
  }[]
  merchandise: {
    id: string
    sku: string
    weight: number
    selectedOptions: { name: string, value: string }[]
    product: {
      id: string
      handle: string
      productType: string
    }
    priceV2: {
      amount: number
    }
    compareAtPriceV2: {
      amount: number
    }
  }
  attributes?: { name: string, value: string }[]
}


export interface CartDocument {
  id: string
  lines?: { edges: { node: LineDocument }[] }
  estimatedCost: {
    totalAmount: {
      amount: number
    }
    subtotalAmount: {
      amount: number
    }
    totalTaxAmount: {
      amount: number
    }
  }
  discountCodes: {
    applicable: boolean
    code: string
  }[]
  checkoutUrl: string
}

function postprocessCart(cart: CartDocument) {
  return cart
  // return {
  //   ...cart,
  //   // lines: cart.lines?.edges.map(e => e.node)
  // }
}

export async function createCart(fetch) {
  return request<{
    cartCreate: {
      cart: CartDocument
    }
  }>(fetch, `
    mutation {
      cartCreate(input: {
        lines: []
      }) {
        cart ${cartNode}
      }
    }`).then(result => {
    return postprocessCart(result.data.cartCreate.cart)
  })
}

export async function getCart(fetch, id: string): Promise<CartDocument> {
  return request<{
    cart: CartDocument
  }>(fetch, `
    query {
      cart(id:"${id}") ${cartNode}
    }`).then(result => {
      return postprocessCart(result.data.cart)
    })
}

export async function addToCart(fetch, cart_id: string, id: string, quantity=1) {
  return request<{
    cartLinesAdd: {
      cart: CartDocument
    }
  }>(fetch, `
    mutation {
      cartLinesAdd(lines: [{
        merchandiseId: "${id}",
        quantity: ${quantity}
      }], cartId: "${cart_id}") {
        cart ${cartNode}
      }
    }`).then(result => {
      return postprocessCart(result.data.cartLinesAdd.cart)
    })
}

export async function removeFromCart(fetch, cart_id: string, id: string) {
  return request<{
    cartLinesRemove: {
      cart: CartDocument
    }
  }>(fetch, `
    mutation {
      cartLinesRemove(lineIds: ["${id}"], cartId: "${cart_id}") {
        cart ${cartNode}
      }
    }`).then(result => {
      return postprocessCart(result.data.cartLinesRemove.cart)
    })
}

export async function updateQuantity(fetch, cart_id: string, id: string, quantity: number) {
  return request<{
    cartLinesUpdate: {
      cart: CartDocument
    }
  }>(fetch, `
    mutation {
      cartLinesUpdate(lines: [{
        id: "${id}",
        quantity: ${quantity}
      }], cartId: "${cart_id}") {
        cart ${cartNode}
      }
    }`).then(result => {
      return postprocessCart(result.data.cartLinesUpdate.cart)
    })
}

export async function updateDiscountCode(fetch, cart_id: string, code: string) {
  return request<{
    cartDiscountCodesUpdate: {
      cart: CartDocument
    }
  }>(fetch, `
    mutation {
      cartDiscountCodesUpdate(discountCodes: ["${code}"], cartId: "${cart_id}") {
        cart ${cartNode}
        userErrors {
          code
          field
          message
        }
      }
    }`).then(result => {
      return postprocessCart(result.data.cartDiscountCodesUpdate.cart)
    })
}

export async function removeDiscountCode(fetch, cart_id: string) {
  return request<{
    cartDiscountCodesUpdate: {
      cart: CartDocument
    }
  }>(fetch, `
    mutation {
      cartDiscountCodesUpdate(discountCodes: [], cartId: "${cart_id}") {
        cart ${cartNode}
      }
    }`).then(result => {
      return postprocessCart(result.data.cartDiscountCodesUpdate.cart)
    })
}

export async function updateCartIdentiy(fetch, cartId: string, customerAccessToken: string) {
  return request<{
    cartBuyerIdentityUpdate: {
      cart: CartDocument
    }
  }>(fetch, `
    mutation cartBuyerIdentityUpdate($buyerIdentity: CartBuyerIdentityInput!, $cartId: ID!) {
      cartBuyerIdentityUpdate(buyerIdentity: $buyerIdentity, cartId: $cartId) {
        cart ${cartNode}
        userErrors {
          field
          message
        }
      }
    }`, {
      cartId,
      buyerIdentity: {
        customerAccessToken
      }
    }).then(result => {
    return postprocessCart(result.data.cartBuyerIdentityUpdate.cart)
  })
}


export interface Address {
  id: string
  firstName: string
  lastName: string
  address1: string
  address2: string
  city: string
  company: string
  country: string
  formatted: string[]
  province: string
  zip: string
  phone: string
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  acceptsMarketing: boolean
  email: string
  phone: string
  defaultAddress?: Address
}

const customerNode = `{
  id
  firstName
  lastName
  acceptsMarketing
  email
  phone
}`

export async function fetchCustomer(fetch, token: string) {
  return request<{
    customer: Customer
  }>(fetch, `
    query($token: String!) {
      customer(customerAccessToken: $token) ${customerNode}
    }`, {
      token
    })
}

export async function login(fetch, email: string, password: string) {
  return request<{
    customerAccessTokenCreate: {
      customerAccessToken: {
        accessToken: string
        expiresAt: string
      }
      userErrors: {
        field: string
        message: string
      }[]
    }
  }>(fetch, `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        userErrors {
          field
          message
        }
      }
    }`, {
      input: {
        email,
        password
      }
    })
}

export async function logout(fetch, token: string) {
  return request<{
    customerAccessTokenDelete: {
      deletedAccessToken: string
      expiresAt: string
    }
  }>(fetch, `
    mutation customerAccessTokenDelete($token: String!) {
      customerAccessTokenDelete(customerAccessToken: $token) {
        deletedAccessToken
        deletedCustomerAccessTokenId
        userErrors {
          field
          message
        }
      }
    }`, {
      token
    })
}

export async function create(fetch, email: string, password: string, firstName: string, lastName: string,  acceptsMarketing?: boolean) {
  return request<{
    customerCreate: {
      customer: Customer
      customerUserErrors: {
        field: string
        message: string
      }[]
    }
  }>(fetch, `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer ${customerNode}
        customerUserErrors {
          field
          message
        }
      }
    }`, {
      input: {
        email,
        password,
        firstName,
        lastName,
        acceptsMarketing
      }
    })
}

export async function recover(fetch, email: string) {
  return request<{
    customerRecover: {
      customerUserErrors: {
        field: string
        message: string
      }[]
    }
  }>(fetch, `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors {
          field
          message
        }
      }
    }`, {
      email
    })
}

export async function activate(fetch, id: string, activationToken: string, password: string) {
  return request<{
    customerActivate: {
      customer: Customer
      customerAccessToken: {
        accessToken: string
        expiresAt: string
      }
    }
  }>(fetch, `
    mutation customerActivate($id: ID!, $input: CustomerActivateInput!) {
      customerActivate(id: $id, input: $input) {
        customer ${customerNode}
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }`, {
      id,
      input: {
        activationToken,
        password
      }
    })
}

export async function reset(fetch, id: string, resetToken: string, password: string) {
  return request<{
    customerReset: {
      customer: Customer
      customerAccessToken: {
        accessToken: string
        expiresAt: string
      }
    }
  }>(fetch, `
    mutation customerReset($id: ID!, $input: CustomerResetInput!) {
      customerReset(id: $id, input: $input) {
        customer ${customerNode}
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
        }
      }
    }`, {
      id,
      input: {
        resetToken,
        password
      }
    })
}

export interface Order {
  id: string
  name: string
  fulfillmentStatus: string
  statusUrl: string
  currentTotalPrice: {
    amount: number
    currencyCode: string
  }
}

export async function fetchOrders(fetch, token: string, limit=50, page=0) {
  return request<{
    customer: {
      orders: {
        edges: {
          node: Order
        }[]
      }
    }
  }>(fetch, `
    query($token: String!) {
      customer(customerAccessToken: $token) {
        orders(first: ${limit}) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node {
              id
              name
              fulfillmentStatus
              statusUrl
              currentTotalPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }`, {
      token
    })
}

const addressNode = `{
  id
  firstName
  lastName
  company
  address1
  address2
  city
  province
  country
  zip
  phone
  formatted
}`

export async function fetchAddresses(fetch, token: string, limit=50, page=0) {
  return request<{
    customer: {
      addresses: {
        edges: {
          node: Address
        }[]
      }
    }
  }>(fetch, `
    query($token: String!) {
      customer(customerAccessToken: $token) {
        addresses(first: ${limit}) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            node ${addressNode}
          }
        }
      }
    }`, {
      token
    })
}

export async function createAddress(fetch, token: string, address: object) {
  return request<{
    customerAddressCreate: {
      customerAddress: Address,
      customerUserErrors: {
        field: string
        message: string
      }[]
    }
  }>(fetch, `
    mutation customerAddressCreate($address: MailingAddressInput!, $token: String!) {
      customerAddressCreate(address: $address, customerAccessToken: $token) {
        customerAddress ${addressNode}
        customerUserErrors {
          field
          message
        }
      }
    }`, {
      token,
      address
    })
}

export async function deleteAddress(fetch, token: string, id: string) {
  return request<{
    customerAddressCreate: {
      deletedCustomerAddressId: string
    }
  }>(fetch, `
    mutation customerAddressDelete($token: String!, $id: ID!) {
      customerAddressDelete(customerAccessToken: $token, id: $id) {
        customerUserErrors {
          message
        }
        deletedCustomerAddressId
      }
    }`, {
      token,
      id
    })
}

export async function updateAddress(fetch, token: string, id: string, address: object) {
  return request<{
    customerAddressUpdate: {
      customerAddress: Address,
      customerUserErrors: {
        field: string
        message: string
      }[]
    }
  }>(fetch, `
    mutation customerAddressUpdate($address: MailingAddressInput!, $token: String!, $id: ID!) {
      customerAddressUpdate(address: $address, customerAccessToken: $token, id: $id) {
        customerAddress ${addressNode}
        customerUserErrors {
          field
          message
        }
      }
    }`, {
      id,
      token,
      address
    })
}