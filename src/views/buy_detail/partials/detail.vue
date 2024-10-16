<template>
  <v-container class="pa-0 bg-white">
    <div class="height-detail">
      <v-img
        src="https://demo03.houzez.co/wp-content/uploads/2016/03/016-1170x877.jpg"
        cover
        style="height: 100%"
        aspect-ratio="1.1"
      >
        <v-hover v-slot:default="{ isHovering, props }">
          <div
            v-bind="props"
            :style="[
              isHovering
                ? 'background-color: rgba(0, 0, 0, 0.0)'
                : 'background-color: rgba(0, 0, 0, 0.5)',
              'transition: background-color 0.3s ease',
            ]"
            class="fill-height text-white font-weight-light"
          >
            <div
              class="d-flex flex-column justify-center align-start ga-9 ga-md-6 detail-cont"
            >
              <div class="text-h4 font-weight-light text-white">$1.876.000</div>
              <div class="font-weight-light text-h3 text-white">
                Modern Design Villa With Pool
              </div>
              <div class="d-flex ga-3">
                <div class="d-flex ga-1 align-center">
                  <v-icon icon="mdi-bed-king-outline" />
                  <div class="font-weight-medium text-caption text-md-body-2">
                    1
                  </div>
                </div>
                <div class="d-flex ga-1 align-center">
                  <v-icon icon="mdi-shower-head" />
                  <div class="font-weight-medium text-caption text-md-body-2">
                    1
                  </div>
                </div>
                <div class="d-flex ga-1 align-center">
                  <v-icon icon="mdi-car-back" />
                  <div class="font-weight-medium text-caption text-md-body-2">
                    3
                  </div>
                </div>
                <div class="d-flex ga-1 align-center">
                  <v-icon icon="mdi-ruler-square" />
                  <div class="font-weight-medium text-caption text-md-body-2">
                    500 Sq Ft
                  </div>
                </div>
              </div>
              <v-btn
                variant="outlined"
                class="text-white text-none text-body-2"
              >
                View Property
              </v-btn>
            </div>
          </div>
        </v-hover>
      </v-img>
    </div>
    <v-container class="pt-4 pb-8 w-100 w-md-50">
      <div class="text-h5 text-center">The Nook Apartments</div>
      <p class="text-center text-body-2 mt-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis enim
        vitae asperiores excepturi voluptates accusantium?
      </p>
    </v-container>
  </v-container>
</template>

<style scoped>
@media (min-width: 768px) {
  .detail-cont {
    padding: 100px 200px;
    max-width: 70%;
  }
}

@media (max-width: 768px) {
  .detail-cont {
    padding: 30px 20px;
  }
}

@media (min-width: 768px) {
  .height-detail {
    height: 80vh;
  }
}
</style>
