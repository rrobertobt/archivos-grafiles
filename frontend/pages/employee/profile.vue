<template>
  <div class="flex flex-col gap-6 w-full lg:w-auto" v-if="session">
    <h1 class="text-2xl font-semibold text-color">Información de usuario</h1>
    <ProgressBar mode="indeterminate" class="!h-0.5 !-my-4"
    :class="{ 
      'invisible': !loading 
      }"
    ></ProgressBar>
    <section class="w-full">
      <h4 class="text-xl my-2 font-semibold text-muted-color-emphasis">
        Perfil
      </h4>

      <div class="flex items-center gap-4 flex-col lg:flex-row">
        <FloatLabel variant="in" class="self-start w-full">
          <IconField>
            <InputIcon>
              <Icon name="lucide:square-user" />
            </InputIcon>
            <InputText
              fluid
              readonly
              id="name"
              v-model="session.name"
              variant="filled"
            />
          </IconField>
          <label for="name">Nombre</label>
        </FloatLabel>
        <FloatLabel variant="in" class="self-start w-full">
          <IconField>
            <InputIcon>
              <Icon name="lucide:scan-face" />
            </InputIcon>
            <InputText
              fluid
              readonly
              id="username"
              v-model="session.username"
              variant="filled"
            />
          </IconField>
          <label for="username">Nombre de usuario</label>
        </FloatLabel>
        <FloatLabel variant="in" class="self-start w-full">
          <IconField>
            <InputIcon>
              <Icon name="lucide:id-card" />
            </InputIcon>
            <InputText
              fluid
              readonly
              id="role"
              v-model="roleDisplay"
              variant="filled"
            />
          </IconField>
          <label for="role">Rol</label>
        </FloatLabel>
      </div>
    </section>
    <section>
      <h4 class="text-xl my-2 font-semibold text-muted-color-emphasis">
        Seguridad
      </h4>

      <span class="flex items-center gap-2 my-2">
        <h6 class="text-sm text-muted-color-emphasis">Cambiar contraseña</h6>
        <ToggleSwitch v-model="enableEditPassword" />
      </span>

      <div>
        <form
          class="flex justify-center gap-4 flex-col"
          @submit.prevent="handlePasswordUpdate"
        >
          <div class="flex items-center gap-4 flex-col lg:flex-row">
            <FloatLabel variant="in" class="self-start w-full">
              <InputGroup>
                <IconField class="!w-full">
                  <InputIcon>
                    <Icon name="lucide:key-round" />
                  </InputIcon>
                  <InputText
                    fluid
                    :class="{ '!font-mono': showPassword }"
                    :type="showPassword ? 'text' : 'password'"
                    class="!w-full !border-r-1 !rounded-tr-none !rounded-br-none !text-sm"
                    :disabled="!enableEditPassword"
                    id="password"
                    v-model="newCredentials.password"
                    variant="outlined"
                  />
                </IconField>
                <Button
                  size="small"
                  :icon="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                  class="!border-l-0"
                  severity="secondary"
                  :disabled="!enableEditPassword || loading"
                  outlined
                  @click="showPassword = !showPassword"
                />
              </InputGroup>
              <label for="password">Contraseña</label>
            </FloatLabel>
            <FloatLabel variant="in" class="self-start w-full">
              <InputGroup>
                <IconField class="!w-full">
                  <InputIcon>
                    <Icon name="lucide:key-round" />
                  </InputIcon>
                  <InputText
                    fluid
                    :class="{
                      '!font-mono': showPassword,
                    }"
                    :type="showPassword ? 'text' : 'password'"
                    class="!w-full !border-r-1 !rounded-tr-none !rounded-br-none !text-sm"
                    :disabled="!enableEditPassword"
                    id="passwordConfirmation"
                    v-model="newCredentials.passwordConfirmation"
                    variant="outlined"
                  />
                </IconField>
                <Button
                  size="small"
                  :icon="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                  class="!border-l-0"
                  severity="secondary"
                  :disabled="!enableEditPassword || loading"
                  outlined
                  @click="showPassword = !showPassword"
                />
              </InputGroup>
              <label for="passwordConfirmation">Confirmar contraseña</label>
            </FloatLabel>
          </div>
          <Button
            :disabled="
              !enableEditPassword ||
              newCredentials.password.length === 0 ||
              newCredentials.passwordConfirmation.length === 0
            "
            type="submit"
            label="Guardar"
            severity="secondary"
          >
            <template #icon>
              <Icon name="lucide:save" />
            </template>
          </Button>
        </form>
      </div>
    </section>
  </div>
</template>
<script setup>
  const sessionStore = useSessionStore();
  const { session, roleDisplay, loading } = storeToRefs(sessionStore);
  const { updatePassword, fetchUserData } = useSessionStore();

  await useLazyAsyncData(() => fetchUserData());
  
  const enableEditPassword = ref(false);

  const showPassword = ref(false);

  const handlePasswordUpdate = async () => {
    if (
      newCredentials.value.password ===
        newCredentials.value.passwordConfirmation &&
      newCredentials.value.password.length > 0
    ) {
      await updatePassword(newCredentials.value.password);
      newCredentials.value.password = "";
      newCredentials.value.passwordConfirmation = "";
      enableEditPassword.value = false;
    } else {
      const toast = useToastService();
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "Las contraseñas no coinciden",
      });
    }
  };

  const newCredentials = ref({
    password: "",
    passwordConfirmation: "",
  });

  definePageMeta({
    layout: "employee",
  });
</script>
<style lang="postcss" scoped></style>
