<template>
    <div class="container mx-auto d-flex justify-center pt-8 text-center">
        <div>
            <div class="text-h4 text-deep-purple-darken-3">Get your Biryani</div>

            <div class="text-h6 font-weight-bold pt-4">From</div>

            <v-autocomplete
            placeholder="--Select Town--"
            class="border rounded mt-6 custom-input-height"
            
            :items="['Marine Parade']"
            ></v-autocomplete>



        </div>
      
    </div>
</template>