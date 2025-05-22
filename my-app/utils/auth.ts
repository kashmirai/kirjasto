import { supabase } from "@/utils/supabase/supabaseClient";

interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone : string;
}



export async function registerUser({ email, password, first_name, last_name, phone }: RegisterData) {
  // 1. Luo käyttäjä Supabase authiin
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error };
  }

  // 2. Lisää käyttäjän lisätiedot omaan tauluun (esim. 'members')
  if (data.user) {
    const { error: insertError } = await supabase
      .from("members")
      .insert([
        {
          member_id: data.user.id, // Supabasen user id
          email,
          first_name,
          last_name,
          phone
        },
      ]);

    if (insertError) {
      return { error: insertError };
    }
  }

  return { data };
}

export async function loginUser(email: string, password: string) {

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };

  } catch (error) {
    return {data : null, error : error}
  }

}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
