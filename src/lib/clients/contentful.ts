export async function query<T = any>(fetch, query: string, variables?: {[key:string]: any}, preview?: boolean): Promise<{ data: T, errors: { message: string }[] }> {
  console.log(variables)

  const res = await fetch(
    'https://graphql.contentful.com/content/v1/spaces/7se2xe1qbg81/environments/master', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': preview ? 'Bearer 76fJQ7L-npvziT_u0vMUamYc_vAAsFTE8TMOsqOUeRU' : 'Bearer NYhOEXuMAzPsefC1wXElqeMqWqcgXApEkfOwGBWYlUc'
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