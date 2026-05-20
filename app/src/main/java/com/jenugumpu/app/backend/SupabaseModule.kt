package com.jenugumpu.app.backend

import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.realtime.Realtime
import io.github.jan.supabase.storage.Storage

object SupabaseModule {

    val client = createSupabaseClient(
        supabaseUrl = "https://glaawhsjdnsshffbvbww.supabase.co",
        supabaseKey = "sb_publishable_I7TzBoHX9JlNU7YRozyEhw_0opDMODP",
    ) {
        install(Auth)
        install(Postgrest)
        install(Storage)
        install(Realtime)
    }
}
