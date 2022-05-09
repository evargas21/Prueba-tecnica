<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
      v-if="! modoEdicion"
      :definitions="{
        save: {
          tip: 'Guardar task',
          icon: 'save',
          label: 'Guardar',
          handler: saveWork
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
    />

    <q-editor
      v-else
      v-model="editor"
      :definitions="{
        save: {
          tip: 'Actualizar task',
          icon: 'save',
          label: 'Actualizar',
          handler: updateWork
        }
      }"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
    />

    <!-- Card -->
    <q-card class="row" flat bordered v-for="(item, index) in tasks" :key="index">
      <q-card-section class="col" v-html="item.texto" :class="item.estado ? 'tachar' : ''" />
      <q-card-actions align="right">
        <q-chip v-if="item.estado == true" v-html="tareaTerminada" size="md" icon="bookmark"></q-chip>
        <q-chip v-else v-html="tareaNoTerminada" size="md" icon="bookmark"></q-chip>

        <q-btn flat color="blue" @click="editarEstado(index, item.id)">Acción de Estado</q-btn>
        <q-btn flat color="warning" @click="editar(index, item.id)">Editar</q-btn>
        <q-btn flat color="red" @click="eliminar(index, item.id)">Eliminar</q-btn>
      </q-card-actions>
    </q-card>

    <!-- Opción -->
    <div class="flex flex-center" v-if="tasks.length == 0">
      <h6>Sin Tareas</h6>
    </div>
  </div>
</template>

<script>
import { db } from "boot/firebase";

export default {
  data() {
    return {
      editor: "",
      tareaTerminada: "Tarea terminada",
      tareaNoTerminada: "Tarea no terminada",
      tasks: [],
      modoEdicion: false,
      id: null,
      index: null,
    };
  },
  created() {
    this.listarTareas();
  },
  methods: {
    // Editar estados de tarea
    async editarEstado(index, id) {
      try {
        if (!this.tasks[index].estado) {
          const resDB = await db.collection("tareas").doc(id).update({
            estado: true,
          });
          this.tasks[index].estado = true;
        } else {
          const resDB = await db.collection("tareas").doc(id).update({
            estado: false,
          });

          this.tasks[index].estado = false;
        }
      } catch (error) {
        this.$q.notify({
          message: error,
          color: "red",
          textColor: "white",
          icon: "clear",
        });
      }
    },

    // Actualizar
    async updateWork() {
      try {
        if (this.editor.length == 0) {
          this.$q.notify({
            message: "No puede enviar una tarea vacia!",
            color: "warning",
            textColor: "white",
            icon: "warning",
          });
        } else {
          const resDB = await db.collection("tareas").doc(this.id).update({
            texto: this.editor,
          });

          this.tasks[this.index].texto = this.editor;

          this.$q.notify({
            message: "Tarea actualizada con exíto!",
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.modoEdicion = false;
        this.index = null;
        this.id = null;
        this.editor = "";
      }
    },

    // Editar
    editar(index, id) {
      this.modoEdicion = true;
      this.index = index;
      this.id = id;
      this.editor = this.tasks[index].texto;
    },

    // listar
    async listarTareas() {
      try {
        const respDB = await db.collection("tareas").get();
        respDB.forEach((res) => {
          // console.log(res.id);
          const tarea = {
            id: res.id,
            texto: res.data().texto,
            estado: res.data().estado,
          };
          this.tasks.push(tarea);
        });
      } catch (error) {
        console.log(error);
      }
    },
    // Guardar tareas
    async saveWork() {
      try {
        if (this.editor.length == 0) {
          this.$q.notify({
            message: "No puede enviar una tarea vacia!",
            color: "warning",
            textColor: "white",
            icon: "warning",
          });
        } else {
          const resDB = await db.collection("tareas").add({
            texto: this.editor,
            estado: false,
          });
          // Agregar tarea
          this.tasks.push({
            texto: this.editor,
            estado: false,
            id: resDB.id,
          });
          this.editor = "";
          this.$q.notify({
            message: "Tarea guardada con exíto!",
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
          });
        }
      } catch (error) {
        this.$q.notify({
          message: error,
          color: "red",
          textColor: "white",
          icon: "clear",
        });
      }
    },
    // Eliminar tarea
    eliminar(index, id) {
      this.$q
        .dialog({
          dark: true,
          title: "Acción peligrosa",
          message: "Realmente desea eliminar esta tarea ?",
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          // console.log('>>>> OK')
          try {
            await db.collection("tareas").doc(id).delete();
            this.tasks.splice(index, 1);
            this.$q.notify({
              message: "Tarea eliminada con exíto!",
              color: "green-4",
              textColor: "white",
              icon: "cloud_done",
            });
          } catch (error) {
            this.$q.notify({
              message: error,
              color: "red",
              textColor: "white",
              icon: "clear",
            });
          }
        });
    },
  },
};
</script>

<style>
.tachar {
  text-decoration: line-through;
}
</style>