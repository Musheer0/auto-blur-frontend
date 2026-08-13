import prisma from "@/db";
import { client } from "./client";

export const createDodoCustomer = async(email:string, name:string)=>{
    const customer = await client.customers.create({ email: email, name: name });
    return customer.customer_id
}
