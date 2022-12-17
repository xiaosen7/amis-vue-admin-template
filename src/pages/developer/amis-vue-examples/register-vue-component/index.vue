<template>
  <CAmisView :schema="schema" :localPathToSave="localPathToSave" />
</template>

<script setup lang="ts">
import schema from './schema.json';
import localPathToSave from './schema.json?sourcePath';
</script>
