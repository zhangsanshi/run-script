<script>
  import List from './list.vue';
  import Status from '../config/status.js';
  export default List.extend({
    data() {
      return {
        listStatusText: Status.on
      };
    }
  });
</script>