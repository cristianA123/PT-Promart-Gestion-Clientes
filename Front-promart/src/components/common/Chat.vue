<template>
  <div
    class="content-img" 
  >
    <div 
      class="content-img--sms-text"
    >
      <div
        class="content_message"
      >
        <div
          v-for="message in messages"
          :key="message.text"
          class="sms d-flex flex-column"
          :class="[
            message.type === '1' && message.text.length < 20 ? 'my-sms-posicion': 'sms-received-posicion', 
          ]"
        >
          <div
            :class="[
              message.type === '1' ? 'content-sms': ''
            ]"
          >
            <div>

              <span
                class="sms-text"
                :class="[
                  message.type === '1' ? 'my-sms': 'sms-received', 
                  message.text.length > 21 ? 'sms-block' : 'sms-inline'
                ]"
              >{{ message.text }}
              </span>
            </div>
            <span
              :class="[
                message.type === '1' ? 'my-sms-date': 'sms-received-date'
              ]"
            >{{ message.date }}</span>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      default: () => [
        {
          type: '2',
          text: 'Como te ayudo?',
          date: 'hoy, 10:54'
        },
        {
          type: '1',
          text: 'Como t',
          date: 'hoy, 10:54'
        },
        {
          type: '2',
          text: 'ok',
          date: 'hoy'
        },
        {
          type: '1',
          text: 'Necesito informacion sobre la matricula',
          date: 'hoy, 10:56'
        },
        {
          type: '2',
          text: 'La matricula se va a realizar el dia de mañana a las 8:00 am :D',
          date: 'hoy, 10:58'
        },
        {
          type: '1',
          text: 'Es muy tarde, esxiste alguna manera de hacerlo online?',
          date: 'hoy, 11:29'
        },
        {
          type: '2',
          text: 'Pero como es? ;)',
          date: 'hoy, 12:29'
        }
      ]
    }
  },
  data() {
    return {
  
    }
  },
  computed: {
   
  }
    
}
</script>

<style scoped>

.content-img {
  background-image: url(https://cdn.discordapp.com/attachments/783095481227935744/984913157703225354/sms_preview.png); 
  width: 250px; 
  height: 430px; 
  background-size: 100%;
  position: relative;

}

.content-img--sms-text {
  position: absolute;
  top: 90px;
  left: 45px;
}

.content_message {
  overflow: scroll;
  height: 285px;
  padding-right: 5px;
  width: 167px;
}

.content_message::-webkit-scrollbar {
  width: 3px;
}
.content_message::-webkit-scrollbar-thumb {
  background: #414141;
}

.sms {
  margin-bottom: 5px;
}

.my-sms-date{
  font-size: 10px;
  text-align: end;
  display: block;
}

.sms-received-date{
  font-size: 10px;
  text-align: start;
  display: block;
}

.content-sms {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.sms-text {
  border-radius: 10px;
  font-size: 12px;
  padding: 5px 10px;
  width: 160px;
  color: black;
  display: inline;

}

.my-sms {
    background-color: rgb(88, 233, 83);
    text-align: right;
    color: #fff;
}
.my-sms-posicion {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.sms-received  {
    background-color: rgb(230, 230, 235);
    text-align: left;
    color: #000;
}

.sms-received-posicion {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.sms-block {
    display: block;
}

.sms-inline {
    display: inline;
}

</style>